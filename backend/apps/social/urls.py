from django.urls import path
from . import family_views

urlpatterns = [
    # Family Albums
    path('family-albums/', family_views.FamilyAlbumsView.as_view(), name='family-albums'),
    path('family-albums/<uuid:album_id>/media/', family_views.AlbumMediaView.as_view(), name='album-media'),
]
