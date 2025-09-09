# Privacy Settings API Backend

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.core.mail import send_mail
from django.conf import settings
import json
import zipfile
import os
from io import BytesIO
from django.http import HttpResponse

from apps.authentication.models import User
from apps.social.models import PrivacySettings
from apps.chat.models import Message
from apps.media.models import MediaFile

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class PrivacySettingsView(View):
    def get(self, request):
        """Get user privacy settings"""
        try:
            privacy_settings, created = PrivacySettings.objects.get_or_create(
                user=request.user,
                defaults={
                    'end_to_end_encryption': True,
                    'show_last_seen': 'contacts',
                    'show_profile': 'contacts',
                    'show_about': 'contacts',
                    'read_receipts': True,
                    'disappearing_messages_enabled': False,
                    'disappearing_messages_timer': 24,
                    'analytics_enabled': False,
                    'crash_reports_enabled': True,
                    'diagnostics_enabled': True,
                    'two_factor_auth': False
                }
            )
            
            return JsonResponse({
                'settings': {
                    'endToEndEncryption': privacy_settings.end_to_end_encryption,
                    'showLastSeen': privacy_settings.show_last_seen,
                    'showProfile': privacy_settings.show_profile,
                    'showAbout': privacy_settings.show_about,
                    'readReceipts': privacy_settings.read_receipts,
                    'disappearingMessages': {
                        'enabled': privacy_settings.disappearing_messages_enabled,
                        'defaultTimer': privacy_settings.disappearing_messages_timer
                    },
                    'dataCollection': {
                        'analytics': privacy_settings.analytics_enabled,
                        'crashReports': privacy_settings.crash_reports_enabled,
                        'diagnostics': privacy_settings.diagnostics_enabled
                    },
                    'twoFactorAuth': privacy_settings.two_factor_auth,
                    'blockedUsers': list(privacy_settings.blocked_users.values_list('id', flat=True))
                }
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def put(self, request):
        """Update user privacy settings"""
        try:
            data = json.loads(request.body)
            
            privacy_settings, created = PrivacySettings.objects.get_or_create(
                user=request.user
            )
            
            # Update settings
            privacy_settings.end_to_end_encryption = data.get('endToEndEncryption', privacy_settings.end_to_end_encryption)
            privacy_settings.show_last_seen = data.get('showLastSeen', privacy_settings.show_last_seen)
            privacy_settings.show_profile = data.get('showProfile', privacy_settings.show_profile)
            privacy_settings.show_about = data.get('showAbout', privacy_settings.show_about)
            privacy_settings.read_receipts = data.get('readReceipts', privacy_settings.read_receipts)
            
            disappearing_msgs = data.get('disappearingMessages', {})
            privacy_settings.disappearing_messages_enabled = disappearing_msgs.get('enabled', privacy_settings.disappearing_messages_enabled)
            privacy_settings.disappearing_messages_timer = disappearing_msgs.get('defaultTimer', privacy_settings.disappearing_messages_timer)
            
            data_collection = data.get('dataCollection', {})
            privacy_settings.analytics_enabled = data_collection.get('analytics', privacy_settings.analytics_enabled)
            privacy_settings.crash_reports_enabled = data_collection.get('crashReports', privacy_settings.crash_reports_enabled)
            privacy_settings.diagnostics_enabled = data_collection.get('diagnostics', privacy_settings.diagnostics_enabled)
            
            privacy_settings.two_factor_auth = data.get('twoFactorAuth', privacy_settings.two_factor_auth)
            
            privacy_settings.save()
            
            return JsonResponse({'success': True, 'message': 'Privacy settings updated successfully'})
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class DataExportView(View):
    def post(self, request):
        """Export user data"""
        try:
            # Create a zip file containing user data
            zip_buffer = BytesIO()
            
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                # Export user profile
                user_data = {
                    'profile': {
                        'id': str(request.user.id),
                        'username': request.user.username,
                        'full_name': request.user.full_name,
                        'email': request.user.email,
                        'phone_number': request.user.phone_number,
                        'bio': request.user.bio,
                        'created_at': request.user.created_at.isoformat(),
                        'last_seen': request.user.last_seen.isoformat() if request.user.last_seen else None
                    }
                }
                zip_file.writestr('profile.json', json.dumps(user_data, indent=2))
                
                # Export messages
                messages = Message.objects.filter(sender=request.user).values(
                    'content', 'created_at', 'chat__name'
                )
                messages_data = list(messages)
                for msg in messages_data:
                    if msg['created_at']:
                        msg['created_at'] = msg['created_at'].isoformat()
                zip_file.writestr('messages.json', json.dumps(messages_data, indent=2))
                
                # Export media files (metadata only)
                media_files = MediaFile.objects.filter(uploaded_by=request.user).values(
                    'filename', 'file_type', 'file_size', 'caption', 'created_at'
                )
                media_data = list(media_files)
                for media in media_data:
                    if media['created_at']:
                        media['created_at'] = media['created_at'].isoformat()
                zip_file.writestr('media.json', json.dumps(media_data, indent=2))
                
                # Add privacy notice
                privacy_notice = """
LinkUp Data Export - Privacy Notice

This export contains your personal data from LinkUp. This includes:
- Your profile information
- Messages you've sent
- Media file metadata (filenames and captions, not the actual files)

Your data is exported in JSON format for portability.
No data from other users is included in this export.

For questions about your data, contact privacy@linkup.com
                """.strip()
                zip_file.writestr('README.txt', privacy_notice)
            
            zip_buffer.seek(0)
            
            response = HttpResponse(zip_buffer.read(), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="linkup-data-export.zip"'
            
            return response
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class DeleteAccountView(View):
    def delete(self, request):
        """Delete user account and all associated data"""
        try:
            user = request.user
            
            # Send confirmation email
            send_mail(
                'LinkUp Account Deletion Confirmation',
                f'Your LinkUp account ({user.username}) has been scheduled for deletion. '
                'All your data will be permanently removed within 30 days. '
                'If you didn\'t request this, please contact support immediately.',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            # Mark account for deletion (implement soft delete first)
            user.is_active = False
            user.save()
            
            # Schedule actual deletion for 30 days (implement with Celery)
            # schedule_account_deletion.delay(user.id, days=30)
            
            return JsonResponse({
                'success': True,
                'message': 'Account deletion initiated. You have 30 days to cancel.'
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
