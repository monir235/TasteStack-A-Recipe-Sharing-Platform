# User Registration 400 Error - Troubleshooting Guide

## Problem
You're getting a 400 Bad Request error when trying to register new users.

## Quick Fixes Applied

### 1. Enhanced Backend Error Handling
- ✅ Added detailed debug logging in `accounts/views.py`
- ✅ Improved error messages and validation
- ✅ Added proper error formatting for frontend

### 2. Improved Serializer Validation
- ✅ Enhanced `UserRegistrationSerializer` with better validation
- ✅ Added password strength requirements
- ✅ Added username and email uniqueness checks
- ✅ Added field-level validation

### 3. Better Frontend Error Handling
- ✅ Improved error display in `RegisterPage.js`
- ✅ Added client-side validation
- ✅ Better error message parsing

## Testing Steps

### Step 1: Test Backend Directly
1. Make sure Django server is running:
   ```bash
   cd "C:\Users\acer\Downloads\New folder\backend"
   python manage.py runserver 127.0.0.1:8000
   ```

2. Test registration manually using Python:
   ```bash
   cd "C:\Users\acer\Downloads\New folder\backend"
   python test_registration_django.py
   ```

### Step 2: Check for Common Issues

#### A. Existing Users
Check if username/email already exists:
```bash
cd "C:\Users\acer\Downloads\New folder\backend"
python manage.py shell -c "from accounts.models import User; [print(f'{u.username} - {u.email}') for u in User.objects.all()]"
```

#### B. Password Requirements
Ensure password meets requirements:
- At least 8 characters long
- Not entirely numeric
- Not common passwords (like "password", "12345678")

#### C. Username Requirements
Ensure username:
- At least 3 characters long
- Contains only letters, digits, and @/./+/-/_ characters

### Step 3: Test Frontend Registration

1. Start the frontend server:
   ```bash
   cd "C:\Users\acer\Downloads\New folder\frontend"
   npm start
   ```

2. Go to the registration page and try with these test values:
   - **Username**: `newuser123` (make sure this doesn't exist)
   - **Email**: `newuser@example.com` (make sure this doesn't exist)
   - **Password**: `securepassword123`
   - **Confirm Password**: `securepassword123`

3. Open browser developer tools (F12) and check:
   - Console for error messages
   - Network tab to see the actual API request and response

### Step 4: Debug API Calls

If you want to test the API directly from browser console:

```javascript
// Test registration API call
fetch('http://localhost:8000/api/auth/register/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'testuser999',
        email: 'testuser999@example.com',
        password: 'securepassword123',
        password_confirm: 'securepassword123'
    })
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
```

## Common Error Messages and Solutions

### "A user with this username already exists"
**Solution**: Use a different username or delete the existing user

### "A user with this email already exists"
**Solution**: Use a different email or delete the existing user

### "Password must be at least 8 characters long"
**Solution**: Use a longer password

### "Password cannot be entirely numeric"
**Solution**: Include letters in your password

### "Passwords do not match"
**Solution**: Make sure password and confirm password are identical

## Next Steps

1. **Start the backend server** and check for debug output in the console
2. **Try registering** with a completely new username and email
3. **Check the browser console** for detailed error messages
4. **Look at the Django console** for debug output from the registration view

## Files Modified
- `backend/accounts/views.py` - Enhanced error handling and debugging
- `backend/accounts/serializers.py` - Better validation
- `frontend/src/pages/RegisterPage.js` - Improved error display
- `test_registration_django.py` - Django-based registration testing

The registration should now provide much clearer error messages. If you're still getting 400 errors, check the Django console output for the detailed debug information.
