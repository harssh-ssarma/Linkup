from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Contact, Follow, OTPVerification

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('phone_number', 'full_name', 'email', 'is_verified', 'phone_verified', 'created_at')
    list_filter = ('is_verified', 'phone_verified', 'is_online', 'created_at')
    search_fields = ('phone_number', 'full_name', 'email')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        ('Personal info', {'fields': ('full_name', 'email', 'bio', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Status', {'fields': ('is_online', 'last_seen', 'is_verified', 'phone_verified', 'email_verified')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'full_name', 'password1', 'password2'),
        }),
    )

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'otp_code', 'is_verified', 'expires_at', 'created_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('phone_number',)
    ordering = ('-created_at',)

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('user', 'contact_user', 'name', 'is_blocked', 'is_favorite', 'created_at')
    list_filter = ('is_blocked', 'is_favorite', 'created_at')
    search_fields = ('user__full_name', 'contact_user__full_name', 'name')

@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following', 'created_at')
    search_fields = ('follower__full_name', 'following__full_name')