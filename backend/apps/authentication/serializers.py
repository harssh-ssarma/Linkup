from rest_framework import serializers
from .models import User, Contact, Follow

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'full_name', 'email', 'phone_number',
            'bio', 'avatar_url', 'is_online', 'last_seen', 'is_verified',
            'followers_count', 'following_count', 'posts_count',
            'phone_verified', 'email_verified', 'created_at'
        ]
        read_only_fields = [
            'id', 'username', 'phone_number', 'is_verified',
            'followers_count', 'following_count', 'posts_count',
            'phone_verified', 'email_verified', 'created_at'
        ]
    
    def get_avatar_url(self, obj):
        return obj.get_avatar_url()

class ContactSerializer(serializers.ModelSerializer):
    contact_user = UserSerializer(read_only=True)
    
    class Meta:
        model = Contact
        fields = ['id', 'contact_user', 'name', 'is_blocked', 'is_favorite', 'created_at']

class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)
    
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']