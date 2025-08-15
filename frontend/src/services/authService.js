import apiRequest from './api';

// Flag to determine if we should use mock API
const USE_MOCK_API = false; // Set to false when backend is available

// User registration
export const register = async (userData) => {
  return apiRequest('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

// User login
export const login = async (credentials) => {
  const data = await apiRequest('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return data;
};

// User logout
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user profile
export const getCurrentUser = async () => {
  return apiRequest('/auth/user/');
};

// Update user profile
export const updateProfile = async (userData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not authenticated');
  }

  // Handle file upload by creating FormData
  const formData = new FormData();
  Object.keys(userData).forEach(key => {
    if (key === 'profile_picture' && userData[key]) {
      formData.append(key, userData[key]);  // Handle file upload
    } else if (userData[key] !== null && userData[key] !== undefined) {
      formData.append(key, userData[key]);
    }
  });

  // Send request with authorization token
  return apiRequest('/auth/user/update/', {
    method: 'PUT',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
    }
  }, true); // Pass 'true' to indicate that this is a FormData request
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};