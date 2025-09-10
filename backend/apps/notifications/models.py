from django.db import models
from apps.authentication.models import User
import uuid

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('message', 'New Message'),
        ('call', 'Missed Call'),
        ('group_invite', 'Group Invitation'),
        ('friend_request', 'Friend Request'),
        ('mention', 'Mention'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
