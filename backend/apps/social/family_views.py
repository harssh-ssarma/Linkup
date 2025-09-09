# Family Albums API Backend

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.db.models import Q
import json
from datetime import datetime

from apps.authentication.models import User
from apps.social.models import FamilyAlbum, AlbumMember, AlbumMedia

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class FamilyAlbumsView(View):
    def get(self, request):
        """Get user's family albums"""
        try:
            # Get albums where user is a member or creator
            albums = FamilyAlbum.objects.filter(
                Q(created_by=request.user) | Q(members__user=request.user)
            ).distinct().prefetch_related('members__user', 'media')
            
            albums_data = []
            for album in albums:
                members = [{
                    'id': str(member.user.id),
                    'name': member.user.full_name,
                    'avatar': member.user.get_avatar_url(),
                    'isOnline': member.user.is_online
                } for member in album.members.all()]
                
                albums_data.append({
                    'id': str(album.id),
                    'name': album.name,
                    'description': album.description,
                    'coverImage': album.get_cover_image_url(),
                    'members': members,
                    'mediaCount': album.media.count(),
                    'lastUpdated': album.updated_at.strftime('%Y-%m-%d'),
                    'createdBy': str(album.created_by.id),
                    'privacy': album.privacy_level,
                    'isAdmin': album.created_by == request.user
                })
            
            return JsonResponse({'albums': albums_data})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def post(self, request):
        """Create a new family album"""
        try:
            data = json.loads(request.body)
            
            album = FamilyAlbum.objects.create(
                name=data['name'],
                description=data.get('description', ''),
                privacy_level=data.get('privacy', 'family'),
                created_by=request.user
            )
            
            # Add creator as admin member
            AlbumMember.objects.create(
                album=album,
                user=request.user,
                role='admin'
            )
            
            # Add selected members
            if data.get('selectedMembers'):
                for member_id in data['selectedMembers']:
                    try:
                        user = User.objects.get(id=member_id)
                        AlbumMember.objects.create(
                            album=album,
                            user=user,
                            role='member'
                        )
                    except User.DoesNotExist:
                        continue
            
            return JsonResponse({
                'success': True,
                'album': {
                    'id': str(album.id),
                    'name': album.name,
                    'description': album.description
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class AlbumMediaView(View):
    def get(self, request, album_id):
        """Get media items for a specific album"""
        try:
            album = FamilyAlbum.objects.get(
                id=album_id,
                members__user=request.user
            )
            
            media_items = AlbumMedia.objects.filter(
                album=album
            ).select_related('uploaded_by').order_by('-created_at')
            
            media_data = [{
                'id': str(media.id),
                'type': media.media_type,
                'url': media.file.url,
                'thumbnail': media.thumbnail.url if media.thumbnail else None,
                'caption': media.caption,
                'uploadedBy': str(media.uploaded_by.id),
                'uploadedAt': media.created_at.strftime('%Y-%m-%d %H:%M'),
                'likes': media.likes.count(),
                'comments': media.comments.count()
            } for media in media_items]
            
            return JsonResponse({'media': media_data})
            
        except FamilyAlbum.DoesNotExist:
            return JsonResponse({'error': 'Album not found or access denied'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def post(self, request, album_id):
        """Upload media to an album"""
        try:
            album = FamilyAlbum.objects.get(
                id=album_id,
                members__user=request.user
            )
            
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No file provided'}, status=400)
            
            media_file = request.FILES['file']
            caption = request.POST.get('caption', '')
            
            # Determine media type
            media_type = 'photo'
            if media_file.content_type.startswith('video/'):
                media_type = 'video'
            
            album_media = AlbumMedia.objects.create(
                album=album,
                file=media_file,
                media_type=media_type,
                caption=caption,
                uploaded_by=request.user
            )
            
            return JsonResponse({
                'success': True,
                'media': {
                    'id': str(album_media.id),
                    'type': media_type,
                    'url': album_media.file.url,
                    'caption': caption
                }
            })
            
        except FamilyAlbum.DoesNotExist:
            return JsonResponse({'error': 'Album not found or access denied'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
