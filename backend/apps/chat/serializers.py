from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Chat, ChatParticipant, Message, MessageStatus, MessageReaction, Call

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'full_name', 'avatar_url', 'is_online', 'last_seen']
    
    def get_avatar_url(self, obj):
        return obj.get_avatar_url()

class ChatParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatParticipant
        fields = ['user', 'role', 'joined_at', 'is_muted']

class ChatSerializer(serializers.ModelSerializer):
    participants = ChatParticipantSerializer(source='chatparticipant_set', many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Chat
        fields = [
            'id', 'chat_type', 'name', 'description', 'avatar', 
            'participants', 'created_at', 'updated_at', 'last_message', 'unread_count'
        ]
    
    def get_last_message(self, obj):
        last_message = obj.messages.filter(is_deleted=False).order_by('-created_at').first()
        if last_message:
            return MessageSerializer(last_message).data
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Count messages not read by current user
            return obj.messages.filter(
                is_deleted=False,
                created_at__gt=request.user.last_seen
            ).exclude(sender=request.user).count()
        return 0

class MessageReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = MessageReaction
        fields = ['user', 'reaction', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    reactions = MessageReactionSerializer(many=True, read_only=True)
    reply_to = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'message_type', 'content', 'media_file', 
            'thumbnail', 'reply_to', 'reactions', 'is_edited', 
            'created_at', 'updated_at'
        ]
    
    def get_reply_to(self, obj):
        if obj.reply_to:
            return {
                'id': obj.reply_to.id,
                'sender': obj.reply_to.sender.full_name,
                'content': obj.reply_to.content[:50] + '...' if len(obj.reply_to.content) > 50 else obj.reply_to.content,
                'message_type': obj.reply_to.message_type
            }
        return None

class CreateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['chat', 'message_type', 'content', 'media_file', 'reply_to']
    
    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)

class CallSerializer(serializers.ModelSerializer):
    caller = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    
    class Meta:
        model = Call
        fields = [
            'id', 'caller', 'receiver', 'call_type', 'status', 
            'duration', 'started_at', 'answered_at', 'ended_at'
        ]