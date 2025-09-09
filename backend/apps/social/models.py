# Additional models for new LinkUp features

from django.db import models
from django.contrib.auth import get_user_model
from apps.authentication.models import User
import uuid

class PrivacySettings(models.Model):
    VISIBILITY_CHOICES = [
        ('everyone', 'Everyone'),
        ('contacts', 'My Contacts'),
        ('nobody', 'Nobody'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='privacy_settings')
    
    # Encryption settings
    end_to_end_encryption = models.BooleanField(default=True)
    
    # Visibility settings
    show_last_seen = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='contacts')
    show_profile = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='contacts')
    show_about = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='contacts')
    
    # Message settings
    read_receipts = models.BooleanField(default=True)
    disappearing_messages_enabled = models.BooleanField(default=False)
    disappearing_messages_timer = models.IntegerField(default=24)  # hours
    
    # Data collection settings
    analytics_enabled = models.BooleanField(default=False)
    crash_reports_enabled = models.BooleanField(default=True)
    diagnostics_enabled = models.BooleanField(default=True)
    
    # Security settings
    two_factor_auth = models.BooleanField(default=False)
    blocked_users = models.ManyToManyField(User, blank=True, related_name='blocked_by')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Privacy settings for {self.user.username}"


class FamilyAlbum(models.Model):
    PRIVACY_CHOICES = [
        ('family', 'Family Only'),
        ('close_friends', 'Close Friends'),
        ('custom', 'Custom Selection'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    privacy_level = models.CharField(max_length=20, choices=PRIVACY_CHOICES, default='family')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_albums')
    cover_image = models.ImageField(upload_to='album_covers/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def get_cover_image_url(self):
        if self.cover_image:
            return self.cover_image.url
        # Return first media item as cover or default
        first_media = self.media.first()
        if first_media:
            return first_media.thumbnail.url if first_media.thumbnail else first_media.file.url
        return '/static/images/default-album-cover.jpg'
    
    def __str__(self):
        return f"{self.name} by {self.created_by.username}"


class AlbumMember(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]
    
    album = models.ForeignKey(FamilyAlbum, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='album_memberships')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('album', 'user')
    
    def __str__(self):
        return f"{self.user.username} in {self.album.name}"


class AlbumMedia(models.Model):
    MEDIA_TYPES = [
        ('photo', 'Photo'),
        ('video', 'Video'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    album = models.ForeignKey(FamilyAlbum, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='album_media/')
    thumbnail = models.ImageField(upload_to='album_thumbnails/', blank=True, null=True)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='photo')
    caption = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_media')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.media_type} in {self.album.name}"


class MediaLike(models.Model):
    media = models.ForeignKey(AlbumMedia, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('media', 'user')


class MediaComment(models.Model):
    media = models.ForeignKey(AlbumMedia, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment by {self.user.username}"


class SmartReplyPreferences(models.Model):
    STYLE_CHOICES = [
        ('formal', 'Formal'),
        ('casual', 'Casual'),
        ('auto', 'Auto'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='smart_reply_prefs')
    language = models.CharField(max_length=10, default='en')
    reply_style = models.CharField(max_length=10, choices=STYLE_CHOICES, default='auto')
    enable_translation = models.BooleanField(default=True)
    enable_emoji = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Smart reply prefs for {self.user.username}"


class UniversalSearchLog(models.Model):
    """Log search queries for improving search functionality"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    query = models.CharField(max_length=255)
    results_count = models.IntegerField(default=0)
    clicked_result_type = models.CharField(max_length=20, blank=True)  # message, media, contact, call
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Search: {self.query} by {self.user.username}"
from apps.authentication.models import User
import uuid

def post_media_path(instance, filename):
    return f'posts/{instance.author.id}/{filename}'

def story_media_path(instance, filename):
    return f'stories/{instance.author.id}/{filename}'

class Post(models.Model):
    VISIBILITY_CHOICES = (
        ('all', 'All Contacts'),
        ('family', 'Family Only'),
        ('friends', 'Friends Only'),
        ('close_friends', 'Close Friends'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(blank=True)
    media_file = models.FileField(upload_to=post_media_path, null=True, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='all')
    
    # Engagement
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'posts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['author', '-created_at']),
            models.Index(fields=['visibility', '-created_at']),
        ]

class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post', 'user')
        db_table = 'post_likes'

class PostComment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'post_comments'
        ordering = ['created_at']

class Story(models.Model):
    STORY_TYPES = (
        ('image', 'Image'),
        ('video', 'Video'),
        ('text', 'Text'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    story_type = models.CharField(max_length=10, choices=STORY_TYPES)
    content = models.TextField(blank=True)  # For text stories
    media_file = models.FileField(upload_to=story_media_path, null=True, blank=True)
    thumbnail = models.ImageField(upload_to='story_thumbnails/', null=True, blank=True)
    
    # Story settings
    visibility = models.CharField(max_length=20, choices=Post.VISIBILITY_CHOICES, default='all')
    allow_replies = models.BooleanField(default=True)
    
    # Auto-delete after 24 hours
    expires_at = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'stories'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['author', '-created_at']),
            models.Index(fields=['expires_at']),
        ]

class StoryView(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='views')
    viewer = models.ForeignKey(User, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('story', 'viewer')
        db_table = 'story_views'

class StoryReaction(models.Model):
    REACTIONS = (
        ('❤️', 'Heart'),
        ('😂', 'Laugh'),
        ('😮', 'Wow'),
        ('😢', 'Sad'),
        ('😡', 'Angry'),
        ('👍', 'Thumbs Up'),
        ('🔥', 'Fire'),
    )
    
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reaction = models.CharField(max_length=10, choices=REACTIONS)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('story', 'user')
        db_table = 'story_reactions'