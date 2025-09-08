from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('send-otp/', views.send_otp, name='send_otp'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('complete-profile/', views.complete_profile, name='complete_profile'),
]