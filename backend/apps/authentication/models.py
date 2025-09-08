from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
import uuid
import os

def user_avatar_path(instance, filename):
    return f'avatars/{instance.id}/{filename}'

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Contact Information
    phone_number = models.CharField(
        max_length=15, 
        unique=True, 
        validators=[RegexValidator(r'^\+?1?\d{9,15}$')],
        help_text="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    email = models.EmailField(unique=True)
    
    # Profile Information
    full_name = models.CharField(max_length=100)
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to=user_avatar_path, null=True, blank=True)
    
    # Status & Privacy
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    
    # Privacy Settings
    show_last_seen = models.CharField(max_length=20, choices=[
        ('everyone', 'Everyone'),
        ('contacts', 'My Contacts'),
        ('nobody', 'Nobody')
    ], default='everyone')
    
    show_profile_photo = models.CharField(max_length=20, choices=[
        ('everyone', 'Everyone'),
        ('contacts', 'My Contacts'),
        ('nobody', 'Nobody')
    ], default='everyone')
    
    show_about = models.CharField(max_length=20, choices=[
        ('everyone', 'Everyone'),
        ('contacts', 'My Contacts'),
        ('nobody', 'Nobody')
    ], default='everyone')
    
    # Social Features
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    posts_count = models.PositiveIntegerField(default=0)
    
    # Verification
    phone_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['email', 'full_name']
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['phone_number']),
            models.Index(fields=['email']),
            models.Index(fields=['is_online', 'last_seen']),
        ]
    
    def get_avatar_url(self):
        if self.avatar:
            return self.avatar.url
        # Generate initials avatar
        initials = ''.join([name[0].upper() for name in self.full_name.split()[:2]])
        return f"https://ui-avatars.com/api/?name={initials}&background=random&color=fff&size=200"
    
    def get_display_name(self):
        return self.full_name or self.username

class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    contact_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacted_by')
    name = models.CharField(max_length=100)  # Custom name for contact
    is_blocked = models.BooleanField(default=False)
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'contact_user')
        db_table = 'contacts'

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following')
        db_table = 'follows'

class OTPVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    phone_number = models.CharField(max_length=15)
    otp_code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'otp_verifications'