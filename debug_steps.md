# Debug Steps for 400 Registration Error

## Step 1: Start the Backend Server

1. Open a new terminal/command prompt
2. Navigate to the backend folder:
   ```bash
   cd "C:\Users\acer\Downloads\New folder\backend"
   ```
3. Start the server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
4. Keep this terminal open and watch for any debug output

## Step 2: Test with Browser Console

1. Open your browser (Chrome/Edge/Firefox)
2. Go to any webpage 
3. Open Developer Tools (F12)
4. Go to the Console tab
5. Paste and run this JavaScript code:

```javascript
// Test registration API call
fetch('http://127.0.0.1:8000/api/auth/register/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'debuguser' + Math.floor(Math.random() * 1000),
        email: 'debuguser' + Math.floor(Math.random() * 1000) + '@example.com',
        password: 'simplepass123',
        password_confirm: 'simplepass123'
    })
})
.then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', [...response.headers.entries()]);
    return response.text();
})
.then(data => {
    console.log('Response:', data);
    try {
        const jsonData = JSON.parse(data);
        console.log('Parsed JSON:', jsonData);
    } catch (e) {
        console.log('Not JSON response');
    }
})
.catch(error => console.error('Fetch Error:', error));
```

## Step 3: Check Django Console Output

Look at the Django terminal for any debug output starting with:
```
=== REGISTRATION DEBUG ===
```

This will show you exactly what data is being received and what errors are occurring.

## Step 4: Common Issues to Look For

### A. CORS Issues
If you see errors about CORS, the browser console will show:
- "Access to fetch ... has been blocked by CORS policy"
- "Cross-Origin Request Blocked"

### B. Server Not Running
If you get connection errors:
- "Failed to fetch"
- "ERR_CONNECTION_REFUSED"

### C. Validation Errors
If you get 400 errors, look for the specific field causing issues:
- "A user with this username already exists"
- "A user with this email already exists"
- Password validation errors

## Step 5: Try Frontend Registration

1. Start the React frontend:
   ```bash
   cd "C:\Users\acer\Downloads\New folder\frontend"
   npm start
   ```
2. Go to http://localhost:3000/register
3. Try to register with:
   - Username: `testuser2024`
   - Email: `testuser2024@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Open browser Developer Tools (F12) and check both Console and Network tabs

## Expected Results

If everything is working:
- Django console shows: "User created successfully: [email]"
- Browser console shows: Status 201
- Frontend redirects to login page

If there's still a 400 error:
- Check the Django console for the specific error message
- Check the browser Network tab to see the exact request and response
