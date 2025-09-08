import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import Chat, Message, MessageStatus, ChatParticipant
from apps.ai.services import ai_service
from apps.ai.models import AIConversation, AIAssistant
import uuid

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.chat_group_name = f'chat_{self.chat_id}'
        self.user = self.scope['user']
        
        if isinstance(self.user, AnonymousUser):
            await self.close()
            return
        
        # Check if user is participant in chat
        is_participant = await self.check_chat_participant()
        if not is_participant:
            await self.close()
            return
        
        # Join chat group
        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )
        
        # Update user online status
        await self.update_user_online_status(True)
        
        await self.accept()
        
        # Send user online notification to group
        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'user_status',
                'user_id': str(self.user.id),
                'status': 'online'
            }
        )

    async def disconnect(self, close_code):
        # Update user offline status
        await self.update_user_online_status(False)
        
        # Send user offline notification
        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'user_status',
                'user_id': str(self.user.id),
                'status': 'offline'
            }
        )
        
        # Leave chat group
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'chat_message':
                await self.handle_chat_message(data)
            elif message_type == 'typing':
                await self.handle_typing(data)
            elif message_type == 'message_read':
                await self.handle_message_read(data)
            elif message_type == 'ai_chat':
                await self.handle_ai_chat(data)
            elif message_type == 'smart_reply_request':
                await self.handle_smart_reply_request(data)
            elif message_type == 'translate_request':
                await self.handle_translate_request(data)
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))

    async def handle_chat_message(self, data):
        content = data['content']
        message_type = data.get('message_type', 'text')
        reply_to_id = data.get('reply_to')
        
        # Create message in database
        message = await self.create_message(
            content=content,
            message_type=message_type,
            reply_to_id=reply_to_id
        )
        
        if message:
            # AI processing in background
            asyncio.create_task(self.process_message_ai(message))
            
            # Send message to chat group
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    'type': 'chat_message',
                    'message': await self.serialize_message(message)
                }
            )

    async def handle_ai_chat(self, data):
        user_message = data['content']
        
        # Get or create AI conversation
        ai_conversation = await self.get_or_create_ai_conversation()
        
        # Get conversation history
        history = await self.get_ai_conversation_history(ai_conversation)
        
        # Generate AI response
        ai_response = await ai_service.chat_with_gpt(user_message, history)
        
        # Save AI interaction
        await self.save_ai_message(ai_conversation, user_message, ai_response)
        
        # Send AI response
        await self.send(text_data=json.dumps({
            'type': 'ai_response',
            'content': ai_response['response'],
            'tokens_used': ai_response['tokens_used'],
            'response_time': ai_response['response_time']
        }))

    async def handle_smart_reply_request(self, data):
        message_content = data['message_content']
        context = data.get('context', [])
        
        # Generate smart replies
        smart_replies = await asyncio.to_thread(
            ai_service.generate_smart_replies,
            message_content,
            context
        )
        
        await self.send(text_data=json.dumps({
            'type': 'smart_replies',
            'suggestions': smart_replies
        }))

    async def handle_translate_request(self, data):
        text = data['text']
        target_language = data['target_language']
        
        # Translate message
        translation = await ai_service.translate_message(text, target_language)
        
        await self.send(text_data=json.dumps({
            'type': 'translation',
            'original_text': text,
            'translated_text': translation['translated_text'],
            'source_language': translation['source_language'],
            'target_language': translation['target_language']
        }))

    async def handle_typing(self, data):
        is_typing = data['is_typing']
        
        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'typing_indicator',
                'user_id': str(self.user.id),
                'is_typing': is_typing
            }
        )

    async def handle_message_read(self, data):
        message_id = data['message_id']
        
        # Update message status
        await self.update_message_status(message_id, 'read')
        
        # Notify sender
        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'message_status_update',
                'message_id': message_id,
                'user_id': str(self.user.id),
                'status': 'read'
            }
        )

    # WebSocket event handlers
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_status',
            'user_id': event['user_id'],
            'status': event['status']
        }))

    async def typing_indicator(self, event):
        # Don't send typing indicator to the sender
        if event['user_id'] != str(self.user.id):
            await self.send(text_data=json.dumps({
                'type': 'typing_indicator',
                'user_id': event['user_id'],
                'is_typing': event['is_typing']
            }))

    async def message_status_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_status_update',
            'message_id': event['message_id'],
            'user_id': event['user_id'],
            'status': event['status']
        }))

    # Database operations
    @database_sync_to_async
    def check_chat_participant(self):
        return ChatParticipant.objects.filter(
            chat_id=self.chat_id,
            user=self.user
        ).exists()

    @database_sync_to_async
    def create_message(self, content, message_type='text', reply_to_id=None):
        try:
            chat = Chat.objects.get(id=self.chat_id)
            reply_to = None
            
            if reply_to_id:
                reply_to = Message.objects.get(id=reply_to_id)
            
            message = Message.objects.create(
                chat=chat,
                sender=self.user,
                content=content,
                message_type=message_type,
                reply_to=reply_to
            )
            
            # Create message statuses for all participants
            participants = ChatParticipant.objects.filter(chat=chat).exclude(user=self.user)
            for participant in participants:
                MessageStatus.objects.create(
                    message=message,
                    user=participant.user,
                    status='sent'
                )
            
            return message
        except Exception as e:
            print(f"Error creating message: {e}")
            return None

    @database_sync_to_async
    def serialize_message(self, message):
        return {
            'id': str(message.id),
            'content': message.content,
            'message_type': message.message_type,
            'sender_id': str(message.sender.id),
            'sender_name': message.sender.username,
            'reply_to': str(message.reply_to.id) if message.reply_to else None,
            'created_at': message.created_at.isoformat(),
            'is_edited': message.is_edited
        }

    @database_sync_to_async
    def update_user_online_status(self, is_online):
        self.user.is_online = is_online
        self.user.save(update_fields=['is_online', 'last_seen'])

    @database_sync_to_async
    def update_message_status(self, message_id, status):
        try:
            MessageStatus.objects.filter(
                message_id=message_id,
                user=self.user
            ).update(status=status)
        except Exception as e:
            print(f"Error updating message status: {e}")

    @database_sync_to_async
    def get_or_create_ai_conversation(self):
        assistant = AIAssistant.objects.filter(assistant_type='chatgpt', is_active=True).first()
        if not assistant:
            assistant = AIAssistant.objects.create(
                name='ChatGPT Assistant',
                assistant_type='chatgpt',
                model_name='gpt-4-turbo-preview',
                system_prompt='You are a helpful AI assistant.'
            )
        
        conversation, created = AIConversation.objects.get_or_create(
            user=self.user,
            assistant=assistant,
            defaults={'title': 'AI Chat'}
        )
        return conversation

    @database_sync_to_async
    def get_ai_conversation_history(self, conversation):
        from apps.ai.models import AIMessage
        messages = AIMessage.objects.filter(
            conversation=conversation
        ).order_by('-created_at')[:10]
        
        history = []
        for msg in reversed(messages):
            history.extend([
                {"role": "user", "content": msg.user_input},
                {"role": "assistant", "content": msg.ai_response}
            ])
        return history

    @database_sync_to_async
    def save_ai_message(self, conversation, user_input, ai_response):
        from apps.ai.models import AIMessage
        AIMessage.objects.create(
            conversation=conversation,
            user_input=user_input,
            ai_response=ai_response['response'],
            tokens_used=ai_response['tokens_used'],
            response_time=ai_response['response_time'],
            model_version=ai_response['model']
        )

    async def process_message_ai(self, message):
        """Background AI processing for messages"""
        try:
            # Sentiment analysis
            sentiment = await asyncio.to_thread(
                ai_service.analyze_sentiment,
                message.content
            )
            
            # Language detection
            language = await asyncio.to_thread(
                ai_service.detect_language,
                message.content
            )
            
            # Content moderation
            moderation = await ai_service.moderate_content(message.content)
            
            # Update message with AI insights
            await self.update_message_ai_data(
                message.id,
                sentiment,
                language,
                moderation
            )
            
        except Exception as e:
            print(f"Error in AI processing: {e}")

    @database_sync_to_async
    def update_message_ai_data(self, message_id, sentiment, language, moderation):
        try:
            message = Message.objects.get(id=message_id)
            message.sentiment_score = sentiment['score']
            message.language_detected = language['language']
            message.save(update_fields=['sentiment_score', 'language_detected'])
            
            # Create sentiment record
            from apps.ai.models import MessageSentiment
            MessageSentiment.objects.create(
                message=message,
                sentiment=sentiment['label'],
                confidence=sentiment['confidence']
            )
            
        except Exception as e:
            print(f"Error updating message AI data: {e}")