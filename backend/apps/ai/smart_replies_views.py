# Smart Replies AI API Backend

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
import json
import re
import openai
from django.conf import settings

# Set up OpenAI API key (add to your settings.py)
# openai.api_key = settings.OPENAI_API_KEY

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class SmartRepliesView(View):
    def post(self, request):
        """Generate smart replies based on conversation context"""
        try:
            data = json.loads(request.body)
            messages = data.get('messages', [])
            user_preferences = data.get('userPreferences', {})
            user_id = data.get('userId')
            
            if not messages:
                return JsonResponse({'replies': []})
            
            last_message = messages[-1]
            
            # Generate AI-powered replies if OpenAI is available
            if hasattr(settings, 'OPENAI_API_KEY') and settings.OPENAI_API_KEY:
                ai_replies = self.generate_ai_replies(messages, user_preferences)
            else:
                ai_replies = []
            
            # Generate contextual replies using pattern matching
            contextual_replies = self.generate_contextual_replies(last_message, user_preferences)
            
            # Generate quick replies
            quick_replies = self.generate_quick_replies(last_message, user_preferences)
            
            # Combine all replies and rank them
            all_replies = ai_replies + contextual_replies + quick_replies
            
            # Remove duplicates and limit to top 6
            seen_texts = set()
            unique_replies = []
            for reply in all_replies:
                if reply['text'].lower() not in seen_texts:
                    seen_texts.add(reply['text'].lower())
                    unique_replies.append(reply)
                    if len(unique_replies) >= 6:
                        break
            
            # Sort by confidence score
            unique_replies.sort(key=lambda x: x['confidence'], reverse=True)
            
            return JsonResponse({'replies': unique_replies[:6]})
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def generate_ai_replies(self, messages, user_preferences):
        """Generate replies using OpenAI GPT"""
        try:
            # Build conversation context
            conversation = ""
            for msg in messages[-5:]:  # Use last 5 messages
                conversation += f"User {msg['senderId']}: {msg['text']}\n"
            
            style = user_preferences.get('replyStyle', 'auto')
            language = user_preferences.get('language', 'en')
            
            style_prompt = {
                'formal': 'formal and professional',
                'casual': 'casual and friendly',
                'auto': 'matching the conversation tone'
            }.get(style, 'natural and appropriate')
            
            prompt = f"""
Based on this conversation, suggest 3 appropriate replies in {style_prompt} style.
The replies should be in {language} language.
Make them concise (under 50 characters each) and contextually relevant.

Conversation:
{conversation}

Generate 3 different reply options as JSON array:
"""
            
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=150,
                temperature=0.7,
                n=1
            )
            
            # Parse OpenAI response (implement proper parsing)
            ai_text = response.choices[0].text.strip()
            
            # For now, return mock AI replies
            return [
                {
                    'id': 'ai_1',
                    'text': 'That makes sense!',
                    'type': 'contextual',
                    'confidence': 0.85
                },
                {
                    'id': 'ai_2', 
                    'text': 'I understand what you mean',
                    'type': 'contextual',
                    'confidence': 0.80
                }
            ]
            
        except Exception as e:
            print(f"AI reply generation failed: {e}")
            return []
    
    def generate_contextual_replies(self, last_message, user_preferences):
        """Generate contextual replies based on message analysis"""
        replies = []
        message_text = last_message['text'].lower()
        
        # Question detection
        if '?' in message_text or any(word in message_text for word in ['what', 'when', 'where', 'why', 'how', 'who']):
            replies.extend([
                {'id': 'ctx_1', 'text': 'Let me think about that', 'type': 'contextual', 'confidence': 0.75},
                {'id': 'ctx_2', 'text': 'Good question!', 'type': 'contextual', 'confidence': 0.70},
                {'id': 'ctx_3', 'text': 'I\'ll get back to you', 'type': 'contextual', 'confidence': 0.65}
            ])
        
        # Gratitude detection
        if any(word in message_text for word in ['thank', 'thanks', 'appreciate']):
            replies.extend([
                {'id': 'ctx_4', 'text': 'You\'re welcome!', 'type': 'contextual', 'confidence': 0.90},
                {'id': 'ctx_5', 'text': 'Happy to help!', 'type': 'contextual', 'confidence': 0.85},
                {'id': 'ctx_6', 'text': 'No problem!', 'type': 'contextual', 'confidence': 0.80}
            ])
        
        # Greeting detection
        if any(word in message_text for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
            replies.extend([
                {'id': 'ctx_7', 'text': 'Hello!', 'type': 'contextual', 'confidence': 0.85},
                {'id': 'ctx_8', 'text': 'Hi there!', 'type': 'contextual', 'confidence': 0.80},
                {'id': 'ctx_9', 'text': 'Hey!', 'type': 'contextual', 'confidence': 0.75}
            ])
        
        # Agreement/disagreement
        if any(word in message_text for word in ['agree', 'right', 'exactly', 'yes']):
            replies.extend([
                {'id': 'ctx_10', 'text': 'Absolutely!', 'type': 'contextual', 'confidence': 0.80},
                {'id': 'ctx_11', 'text': 'I think so too', 'type': 'contextual', 'confidence': 0.75}
            ])
        
        return replies
    
    def generate_quick_replies(self, last_message, user_preferences):
        """Generate quick universal replies"""
        replies = [
            {'id': 'quick_1', 'text': 'Okay', 'type': 'quick', 'confidence': 0.60},
            {'id': 'quick_2', 'text': 'Got it', 'type': 'quick', 'confidence': 0.60},
            {'id': 'quick_3', 'text': 'Sounds good', 'type': 'quick', 'confidence': 0.65},
            {'id': 'quick_4', 'text': 'Sure', 'type': 'quick', 'confidence': 0.60},
        ]
        
        # Add emoji replies if enabled
        if user_preferences.get('enableEmoji', True):
            replies.extend([
                {'id': 'emoji_1', 'text': '👍', 'type': 'emoji', 'confidence': 0.70},
                {'id': 'emoji_2', 'text': '😊', 'type': 'emoji', 'confidence': 0.65},
                {'id': 'emoji_3', 'text': '❤️', 'type': 'emoji', 'confidence': 0.60}
            ])
        
        return replies


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class SmartRepliesPreferencesView(View):
    def get(self, request):
        """Get user's smart replies preferences"""
        try:
            # Get from user profile or defaults
            preferences = {
                'language': 'en',
                'replyStyle': 'auto',
                'enableTranslation': True,
                'enableEmoji': True
            }
            
            return JsonResponse({'preferences': preferences})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def put(self, request):
        """Update user's smart replies preferences"""
        try:
            data = json.loads(request.body)
            
            # Save preferences to user profile
            # This would typically be stored in a UserPreferences model
            
            return JsonResponse({'success': True})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
