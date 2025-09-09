from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count, Max
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Chat, ChatParticipant, Message, MessageReaction, Call
from .serializers import (
    ChatSerializer, MessageSerializer, CreateMessageSerializer,
    CallSerializer, MessageReactionSerializer
)

User = get_user_model()

class MessagePagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(
            participants=user
        ).annotate(
            last_message_time=Max('messages__created_at')
        ).order_by('-last_message_time')
    
    @action(detail=False, methods=['post'])
    def create_private_chat(self, request):
        """Create or get existing private chat with another user"""
        other_user_id = request.data.get('user_id')
        if not other_user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if private chat already exists
        existing_chat = Chat.objects.filter(
            chat_type='private',
            participants=request.user
        ).filter(
            participants=other_user
        ).first()
        
        if existing_chat:
            serializer = self.get_serializer(existing_chat)
            return Response(serializer.data)
        
        # Create new private chat
        chat = Chat.objects.create(
            chat_type='private',
            created_by=request.user
        )
        
        # Add participants
        ChatParticipant.objects.create(chat=chat, user=request.user, role='member')
        ChatParticipant.objects.create(chat=chat, user=other_user, role='member')
        
        serializer = self.get_serializer(chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def create_group_chat(self, request):
        """Create a new group chat"""
        name = request.data.get('name')
        participant_ids = request.data.get('participant_ids', [])
        
        if not name:
            return Response({'error': 'Group name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(participant_ids) < 1:
            return Response({'error': 'At least one participant is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create group chat
        chat = Chat.objects.create(
            chat_type='group',
            name=name,
            created_by=request.user
        )
        
        # Add creator as owner
        ChatParticipant.objects.create(chat=chat, user=request.user, role='owner')
        
        # Add other participants
        for user_id in participant_ids:
            try:
                user = User.objects.get(id=user_id)
                ChatParticipant.objects.create(chat=chat, user=user, role='member')
            except User.DoesNotExist:
                continue
        
        serializer = self.get_serializer(chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def add_participant(self, request, pk=None):
        """Add a participant to group chat"""
        chat = self.get_object()
        user_id = request.data.get('user_id')
        
        if chat.chat_type != 'group':
            return Response({'error': 'Can only add participants to group chats'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user has permission to add participants
        participant = ChatParticipant.objects.filter(chat=chat, user=request.user).first()
        if not participant or participant.role not in ['owner', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id)
            ChatParticipant.objects.get_or_create(chat=chat, user=user, defaults={'role': 'member'})
            return Response({'message': 'Participant added successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['delete'])
    def remove_participant(self, request, pk=None):
        """Remove a participant from group chat"""
        chat = self.get_object()
        user_id = request.data.get('user_id')
        
        if chat.chat_type != 'group':
            return Response({'error': 'Can only remove participants from group chats'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check permissions
        participant = ChatParticipant.objects.filter(chat=chat, user=request.user).first()
        if not participant or participant.role not in ['owner', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id)
            ChatParticipant.objects.filter(chat=chat, user=user).delete()
            return Response({'message': 'Participant removed successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = MessagePagination
    
    def get_queryset(self):
        chat_id = self.request.query_params.get('chat_id')
        if not chat_id:
            return Message.objects.none()
        
        # Verify user has access to this chat
        chat = get_object_or_404(Chat, id=chat_id, participants=self.request.user)
        
        return Message.objects.filter(
            chat=chat,
            is_deleted=False
        ).select_related('sender', 'reply_to').prefetch_related('reactions__user').order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateMessageSerializer
        return MessageSerializer
    
    def perform_create(self, serializer):
        message = serializer.save()
        
        # Update chat's updated_at timestamp
        message.chat.save(update_fields=['updated_at'])
        
        # TODO: Send real-time notification via WebSocket
        
    @action(detail=True, methods=['post'])
    def add_reaction(self, request, pk=None):
        """Add reaction to a message"""
        message = self.get_object()
        reaction = request.data.get('reaction')
        
        if not reaction:
            return Response({'error': 'Reaction is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Remove existing reaction from this user if any
        MessageReaction.objects.filter(message=message, user=request.user).delete()
        
        # Add new reaction
        MessageReaction.objects.create(
            message=message,
            user=request.user,
            reaction=reaction
        )
        
        return Response({'message': 'Reaction added successfully'})
    
    @action(detail=True, methods=['delete'])
    def remove_reaction(self, request, pk=None):
        """Remove reaction from a message"""
        message = self.get_object()
        MessageReaction.objects.filter(message=message, user=request.user).delete()
        return Response({'message': 'Reaction removed successfully'})
    
    @action(detail=True, methods=['patch'])
    def edit_message(self, request, pk=None):
        """Edit a message (only by sender)"""
        message = self.get_object()
        
        if message.sender != request.user:
            return Response({'error': 'Can only edit your own messages'}, status=status.HTTP_403_FORBIDDEN)
        
        new_content = request.data.get('content')
        if not new_content:
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        message.content = new_content
        message.is_edited = True
        message.save(update_fields=['content', 'is_edited', 'updated_at'])
        
        serializer = self.get_serializer(message)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'])
    def delete_message(self, request, pk=None):
        """Delete a message (only by sender)"""
        message = self.get_object()
        
        if message.sender != request.user:
            return Response({'error': 'Can only delete your own messages'}, status=status.HTTP_403_FORBIDDEN)
        
        delete_for_everyone = request.data.get('delete_for_everyone', False)
        
        if delete_for_everyone:
            message.deleted_for_everyone = True
            message.content = 'This message was deleted'
        
        message.is_deleted = True
        message.save(update_fields=['is_deleted', 'deleted_for_everyone', 'content'])
        
        return Response({'message': 'Message deleted successfully'})

class CallViewSet(viewsets.ModelViewSet):
    serializer_class = CallSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Call.objects.filter(
            Q(caller=self.request.user) | Q(receiver=self.request.user)
        ).order_by('-started_at')
    
    @action(detail=False, methods=['post'])
    def initiate_call(self, request):
        """Initiate a new call"""
        receiver_id = request.data.get('receiver_id')
        call_type = request.data.get('call_type', 'voice')
        
        if not receiver_id:
            return Response({'error': 'receiver_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'error': 'Receiver not found'}, status=status.HTTP_404_NOT_FOUND)
        
        call = Call.objects.create(
            caller=request.user,
            receiver=receiver,
            call_type=call_type,
            status='initiated'
        )
        
        # TODO: Send real-time call notification via WebSocket
        
        serializer = self.get_serializer(call)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'])
    def update_call_status(self, request, pk=None):
        """Update call status (answer, decline, end)"""
        call = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['answered', 'declined', 'ended']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Only caller or receiver can update status
        if request.user not in [call.caller, call.receiver]:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        call.status = new_status
        
        if new_status == 'answered' and not call.answered_at:
            from django.utils import timezone
            call.answered_at = timezone.now()
        elif new_status == 'ended' and not call.ended_at:
            from django.utils import timezone
            call.ended_at = timezone.now()
            
            # Calculate duration if call was answered
            if call.answered_at:
                duration = (call.ended_at - call.answered_at).total_seconds()
                call.duration = int(duration)
        
        call.save()
        
        serializer = self.get_serializer(call)
        return Response(serializer.data)