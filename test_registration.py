#!/usr/bin/env python
import requests
import json

# Test data for user registration
test_user_data = {
    "username": "testuser123",
    "email": "test@example.com",
    "password": "testpassword123",
    "password_confirm": "testpassword123"
}

# API endpoint
url = "http://127.0.0.1:8000/api/auth/register/"

# Make the request
try:
    print("Testing user registration...")
    print(f"URL: {url}")
    print(f"Data: {json.dumps(test_user_data, indent=2)}")
    
    response = requests.post(
        url, 
        json=test_user_data,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"\nResponse Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    try:
        response_data = response.json()
        print(f"Response Data: {json.dumps(response_data, indent=2)}")
    except json.JSONDecodeError:
        print(f"Response Text: {response.text}")
    
    if response.status_code == 400:
        print("\n🔍 Analyzing 400 Bad Request error...")
        if response_data:
            for field, errors in response_data.items():
                print(f"  - {field}: {errors}")
    elif response.status_code == 201:
        print("✅ Registration successful!")
    else:
        print(f"⚠️  Unexpected status code: {response.status_code}")
        
except requests.exceptions.ConnectionError:
    print("❌ Connection error - Make sure Django server is running on http://127.0.0.1:8000")
except Exception as e:
    print(f"❌ Error: {e}")
