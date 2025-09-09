from django.urls import path
from .smart_replies_views import SmartRepliesView, SmartRepliesPreferencesView

urlpatterns = [
    path('smart-replies/', SmartRepliesView.as_view(), name='smart_replies'),
    path('smart-replies/preferences/', SmartRepliesPreferencesView.as_view(), name='smart_replies_preferences'),
]
