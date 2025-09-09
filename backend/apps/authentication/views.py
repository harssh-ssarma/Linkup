from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils import timezone
from .models import OTPVerification
import firebase_admin
from firebase_admin import credentials, auth
import json
import os
import random
from datetime import timedelta

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    try:
        cred_dict = {
            "type": "service_account",
            "project_id": settings.FIREBASE_PROJECT_ID,
            "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n'),
            "client_email": settings.FIREBASE_CLIENT_EMAIL,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized successfully")
    except Exception as e:
        print(f"❌ Firebase Admin SDK initialization failed: {e}")

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    """Firebase handles OTP sending on frontend"""
    try:
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return JsonResponse({
                'error': 'Missing phone_number in request data'
            }, status=400)

        print(f"📱 Firebase will send OTP to: {phone_number}")
        
        return JsonResponse({
            'message': 'Firebase will handle OTP sending',
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
    """Verify Firebase ID token"""
    try:
        print(f"📥 Received request data: {request.data}")
        firebase_token = request.data.get('firebase_token')
        
        if not firebase_token:
            print("❌ No firebase_token in request")
            return JsonResponse({
                'error': 'Firebase token is required'
            }, status=400)
        
        # Verify Firebase token
        try:
            decoded_token = auth.verify_id_token(firebase_token)
            email = decoded_token.get('email')
            uid = decoded_token.get('uid')
            name = decoded_token.get('name', '')
            email_verified = decoded_token.get('email_verified', False)
            
            print(f"✅ Firebase token verified for: {email} (UID: {uid})")
            
            return JsonResponse({
                'token': f'auth_token_{uid[:8]}',
                'is_new_user': not name,  # New user if no name set
                'user': {
                    'id': uid,
                    'email': email,
                    'full_name': name,
                    'email_verified': email_verified,
                    'avatar_url': f'https://ui-avatars.com/api/?name={name or email}&background=random&color=fff'
                },
                'message': 'Email verified successfully via Firebase'
            })
            
        except auth.InvalidIdTokenError:
            return JsonResponse({
                'error': 'Invalid Firebase token'
            }, status=400)
        except auth.ExpiredIdTokenError:
            return JsonResponse({
                'error': 'Firebase token has expired'
            }, status=400)
        
    except Exception as e:
        print(f"Error in verify_otp: {str(e)}")
        return JsonResponse({
            'error': f'Token verification failed: {str(e)}'
        }, status=400)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def send_email_otp(request):
    """Send OTP to email address"""
    try:
        email = request.data.get('email')
        auth_mode = request.data.get('auth_mode')
        full_name = request.data.get('full_name', '')
        
        if not email:
            return JsonResponse({
                'error': 'Email is required'
            }, status=400)
        
        # Generate random 6-digit OTP
        otp_code = str(random.randint(100000, 999999))
        
        # Delete any existing OTP for this email
        OTPVerification.objects.filter(phone_number=email).delete()
        
        # Create new OTP record (reusing phone_number field for email)
        OTPVerification.objects.create(
            phone_number=email,  # Using phone_number field for email
            otp_code=otp_code,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        print(f"\n📧 EMAIL OTP: {otp_code} for {email}")
        print(f"🔐 Mode: {auth_mode}, Name: {full_name}\n")
        
        return JsonResponse({
            'message': 'OTP sent to email (Check Django console)',
            'email': email,
            'expires_in': 600
        })
        
    except Exception as e:
        print(f"Error in send_email_otp: {str(e)}")
        return JsonResponse({
            'error': f'Error: {str(e)}'
        }, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_otp(request):
    """Verify email OTP"""
    try:
        email = request.data.get('email')
        otp_code = request.data.get('otp_code')
        
        if not email or not otp_code:
            return JsonResponse({
                'error': 'Email and OTP code are required'
            }, status=400)
        
        # Find OTP record (using phone_number field for email)
        try:
            otp_record = OTPVerification.objects.get(
                phone_number=email,
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
        
        print(f"✅ Email OTP verified for: {email}")
        
        return JsonResponse({
            'token': f'auth_token_{email[:8]}',
            'user': {
                'id': email,
                'email': email,
                'full_name': email.split('@')[0],  # Use email prefix as name
                'avatar_url': f'https://ui-avatars.com/api/?name={email.split("@")[0]}&background=random&color=fff'
            },
            'message': 'Email OTP verified successfully'
        })
        
    except Exception as e:
        print(f"Error in verify_email_otp: {str(e)}")
        return JsonResponse({
            'error': f'Error: {str(e)}'
        }, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def complete_profile(request):
    """Complete profile"""
    try:
        email = request.data.get('email')
        full_name = request.data.get('full_name')
        
        if not email or not full_name:
            return JsonResponse({
                'error': 'Email and full name are required'
            }, status=400)
        
        print(f"✅ Completing profile for {email}: {full_name}")
        
        return JsonResponse({
            'token': f'auth_token_{email[:8]}',
            'user': {
                'id': email,
                'full_name': full_name,
                'email': email,
                'avatar_url': f'https://ui-avatars.com/api/?name={full_name}&background=random&color=fff'
            },
            'message': 'Profile completed successfully'
        })
        
    except Exception as e:
        print(f"Error in complete_profile: {str(e)}")
        return JsonResponse({
            'error': f'Error: {str(e)}'
        }, status=500)