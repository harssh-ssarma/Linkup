from django.db import models
from apps.authentication.models import User
from apps.chat.models import Message, Chat
import uuid

class AIAssistant(models.Model):
    ASSISTANT_TYPES = (
        ('chatgpt', 'ChatGPT'),
        ('claude', 'Claude'),
        ('llama', 'Llama'),
        ('custom', 'Custom'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    assistant_type = models.CharField(max_length=20, choices=ASSISTANT_TYPES)
    model_name = models.CharField(max_length=100)
    system_prompt = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_assistants'

class AIConversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_conversations')
    assistant = models.ForeignKey(AIAssistant, on_delete=models.CASCADE)
    chat = models.OneToOneField(Chat, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=200, blank=True)
    context = models.JSONField(default=dict)  # Conversation memory
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ai_conversations'

class AIMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name='ai_messages')
    message = models.ForeignKey(Message, on_delete=models.CASCADE, null=True, blank=True)
    user_input = models.TextField()
    ai_response = models.TextField()
    tokens_used = models.IntegerField(default=0)
    response_time = models.FloatField()  # in seconds
    model_version = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_messages'

class SmartReply(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='smart_replies')
    suggestion = models.CharField(max_length=200)
    confidence_score = models.FloatField()
    language = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'smart_replies'

class MessageTranslation(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='translations')
    original_language = models.CharField(max_length=10)
    target_language = models.CharField(max_length=10)
    translated_text = models.TextField()
    confidence_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('message', 'target_language')
        db_table = 'message_translations'

class MessageSentiment(models.Model):
    message = models.OneToOneField(Message, on_delete=models.CASCADE, related_name='sentiment')
    sentiment = models.CharField(max_length=20)  # positive, negative, neutral
    confidence = models.FloatField()
    emotions = models.JSONField(default=dict)  # joy, anger, fear, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'message_sentiments'

class AIUsageStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_usage')
    feature = models.CharField(max_length=50)  # translation, smart_reply, chat, etc.
    usage_count = models.IntegerField(default=0)
    tokens_consumed = models.IntegerField(default=0)
    date = models.DateField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'feature', 'date')
        db_table = 'ai_usage_stats'