# Universal Search API Backend

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views import View
import json
from datetime import datetime, timedelta

from apps.authentication.models import User
from apps.chat.models import Message, Chat
from apps.media.models import MediaFile
from apps.social.models import Post

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class UniversalSearchView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            query = data.get('query', '').strip()
            filters = data.get('filters', {
                'messages': True,
                'media': True,
                'contacts': True,
                'calls': False
            })
            limit = min(data.get('limit', 50), 100)  # Max 100 results
            
            if len(query) < 3:
                return JsonResponse({
                    'messages': [],
                    'media': [],
                    'contacts': [],
                    'calls': []
                })
            
            results = {
                'messages': [],
                'media': [],
                'contacts': [],
                'calls': []
            }
            
            # Search Messages
            if filters.get('messages', True):
                messages = Message.objects.filter(
                    Q(content__icontains=query) &
                    (Q(chat__participants=request.user) | Q(sender=request.user))
                ).select_related('sender', 'chat').order_by('-created_at')[:limit//4]
                
                results['messages'] = [{
                    'id': str(msg.id),
                    'message': msg.content,
                    'sender': {
                        'id': str(msg.sender.id),
                        'name': msg.sender.full_name,
                        'avatar': msg.sender.get_avatar_url()
                    },
                    'chat': {
                        'id': str(msg.chat.id),
                        'name': msg.chat.name or 'Direct Message'
                    },
                    'timestamp': msg.created_at.strftime('%Y-%m-%d %H:%M')
                } for msg in messages]
            
            # Search Media
            if filters.get('media', True):
                media_files = MediaFile.objects.filter(
                    Q(filename__icontains=query) |
                    Q(caption__icontains=query),
                    uploaded_by=request.user
                ).select_related('chat').order_by('-created_at')[:limit//4]
                
                results['media'] = [{
                    'id': str(media.id),
                    'filename': media.filename,
                    'type': media.file_type,
                    'url': media.file.url,
                    'thumbnail': media.thumbnail.url if media.thumbnail else None,
                    'caption': media.caption,
                    'chat': {
                        'id': str(media.chat.id) if media.chat else None,
                        'name': media.chat.name if media.chat else 'Private'
                    },
                    'timestamp': media.created_at.strftime('%Y-%m-%d %H:%M')
                } for media in media_files]
            
            # Search Contacts
            if filters.get('contacts', True):
                contacts = User.objects.filter(
                    Q(full_name__icontains=query) |
                    Q(username__icontains=query) |
                    Q(bio__icontains=query)
                ).exclude(id=request.user.id)[:limit//4]
                
                results['contacts'] = [{
                    'id': str(user.id),
                    'name': user.full_name,
                    'username': user.username,
                    'bio': user.bio,
                    'avatar': user.get_avatar_url(),
                    'isOnline': user.is_online
                } for user in contacts]
            
            # Search Calls (placeholder - implement based on your call history model)
            if filters.get('calls', False):
                # Implement call history search here
                results['calls'] = []
            
            return JsonResponse(results)
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
