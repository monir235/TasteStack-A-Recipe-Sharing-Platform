import apiRequest from './api';
import * as mockApi from './mockApi';

// Flag to determine if we should use mock API
const USE_MOCK_API = false; // Set to false when backend is available

// User registration
export const register = async (userData) => {
  if (USE_MOCK_API) {
    return mockApi.register(userData);
  }
  
  return apiRequest('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

// User login
export const login = async (credentials) => {
  if (USE_MOCK_API) {
    const data = await mockApi.login(credentials);
    
    // Store token in localStorage
    if (data.token) {
      console.log('Storing token in localStorage (mock):', data.token); // Debugging
      localStorage.setItem('token', data.token);
    }
    
    return data;
  }
  
  const data = await apiRequest('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  
  console.log('Login response data:', data); // Debugging
  
  // Store token in localStorage
  if (data.token) {
    console.log('Storing token in localStorage:', data.token); // Debugging
    localStorage.setItem('token', data.token);
  }
  
  return data;
};

// User logout
export const logout = () => {
  if (USE_MOCK_API) {
    localStorage.removeItem('token');
    return Promise.resolve({ message: 'Logged out successfully' });
  }
  
  localStorage.removeItem('token');
};

// Get current user profile
export const getCurrentUser = async () => {
  if (USE_MOCK_API) {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage (mock):', token); // Debugging
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Decode the token to get user data (for demo purposes)
    try {
      const userData = JSON.parse(atob(token));
      return userData;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
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
  console.log('Checking if authenticated, token:', token); // Debugging
  return !!token;
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};