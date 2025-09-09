from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from apps.authentication.privacy_views import PrivacySettingsView, DataExportView, DeleteAccountView

def api_home(request):
    return JsonResponse({
        'message': 'Linkup API is running!',
        'status': 'success',
        'version': '2.0.0',
        'features': [
            'Real-time messaging',
            'Universal search',
            'Family albums',
            'Smart replies',
            'Privacy controls',
            'End-to-end encryption'
        ]
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_home, name='api_home'),
    
    # Authentication & User Management
    path('api/auth/', include('apps.authentication.urls')),
    
    # Core Features
    path('api/chat/', include('apps.chat.urls')),
    path('api/search/', include('apps.search.urls')),
    path('api/ai/', include('apps.ai.urls')),
    path('api/social/', include('apps.social.urls')),
    path('api/media/', include('apps.media.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    
    # Privacy & Security
    path('api/user/privacy-settings/', PrivacySettingsView.as_view(), name='privacy_settings'),
    path('api/user/export-data/', DataExportView.as_view(), name='export_data'),
    path('api/user/delete-account/', DeleteAccountView.as_view(), name='delete_account'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)