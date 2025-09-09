from django.urls import path
from .views import UniversalSearchView

urlpatterns = [
    path('universal/', UniversalSearchView.as_view(), name='universal_search'),
]
