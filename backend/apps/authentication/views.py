from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import OTPVerification
import json
import random
from datetime import timedelta

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    """Send OTP to phone number"""
    try:
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return JsonResponse({
                'error': 'Missing phone_number in request data'
            }, status=400)

        # Generate random 6-digit OTP
        otp_code = str(random.randint(100000, 999999))
        
        # Delete any existing OTP for this phone number
        OTPVerification.objects.filter(phone_number=phone_number).delete()
        
        # Create new OTP record
        OTPVerification.objects.create(
            phone_number=phone_number,
            otp_code=otp_code,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        print(f"Generated OTP {otp_code} for {phone_number}")
        
        return JsonResponse({
            'message': 'OTP sent successfully',
            'phone_number': phone_number,
            'expires_in': 600
        })
    except Exception as e:
        print(f"Error in send_otp: {str(e)}")
        return JsonResponse({
            'error': f'Error: {str(e)}'
        }, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP"""
    try:
        phone_number = request.data.get('phone_number')
        otp_code = request.data.get('otp_code')
        
        if not phone_number or not otp_code:
            return JsonResponse({
                'error': 'Phone number and OTP code are required'
            }, status=400)
        
        # Find OTP record
        try:
            otp_record = OTPVerification.objects.get(
                phone_number=phone_number,
                otp_code=otp_code
            )
        except OTPVerification.DoesNotExist:
            return JsonResponse({
                'error': 'Invalid OTP code'
            }, status=400)
        
        # Check if OTP is expired
        if timezone.now() > otp_record.expires_at:
            otp_record.delete()
            return JsonResponse({
                'error': 'OTP has expired'
            }, status=400)
        
        # OTP is valid, delete it
        otp_record.delete()
        
        print(f"OTP verified successfully for {phone_number}")
        
        return JsonResponse({
            'token': 'dummy_token_123',
            'is_new_user': True,
            'message': 'OTP verified successfully'
        })
        
    except Exception as e:
        print(f"Error in verify_otp: {str(e)}")
        return JsonResponse({
            'error': f'Error: {str(e)}'
        }, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def complete_profile(request):
    """Complete profile"""
    try:
        phone_number = request.data.get('phone_number')
        full_name = request.data.get('full_name')
        email = request.data.get('email', '')
        
        print(f"Completing profile for {phone_number}: {full_name}")
        
        return JsonResponse({
            'token': 'auth_token_789',
            'user': {
                'id': 1,
                'full_name': full_name,
                'email': email,
                'phone_number': phone_number,
                'avatar_url': f'https://ui-avatars.com/api/?name={full_name}&background=random&color=fff'
            }
        })
        
    except Exception as e:
        print(f"Error in complete_profile: {str(e)}")
        return JsonResponse({
            'error': f'Error: {str(e)}'
        }, status=500)