#!/usr/bin/env python
"""
Test script to verify API endpoints are working
"""
import requests
import json

def test_api():
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing Linkup API endpoints...")
    print(f"📡 Base URL: {base_url}")
    
    # Test 1: API Home
    try:
        response = requests.get(f"{base_url}/api/")
        print(f"✅ API Home: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ API Home failed: {e}")
    
    # Test 2: Send OTP
    try:
        data = {
            "phone_number": "+911234567890",
            "country_code": "IN"
        }
        response = requests.post(f"{base_url}/api/auth/send-otp/", 
                               json=data,
                               headers={'Content-Type': 'application/json'})
        print(f"✅ Send OTP: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Send OTP failed: {e}")
    
    # Test 3: Verify OTP (with dummy code)
    try:
        data = {
            "phone_number": "+911234567890",
            "otp_code": "123456"
        }
        response = requests.post(f"{base_url}/api/auth/verify-otp/", 
                               json=data,
                               headers={'Content-Type': 'application/json'})
        print(f"✅ Verify OTP: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Verify OTP failed: {e}")

if __name__ == "__main__":
    test_api()