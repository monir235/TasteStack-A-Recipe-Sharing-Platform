// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token); // Debugging
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic API request function
const apiRequest = async (endpoint, options = {}, isFormData = false) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth headers
  const authHeaders = getAuthHeaders();
  
  // Set default headers
  let headers = {
    ...authHeaders,
    ...options.headers
  };
  
  console.log('Headers being sent:', headers); // Debugging
  console.log('Endpoint:', endpoint); // Debugging
  console.log('Options:', options); // Debugging
  console.log('isFormData:', isFormData); // Debugging
  
  // Only set Content-Type to application/json if it's not a FormData request
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  } else {
    console.log('FormData request - not setting Content-Type header'); // Debugging
  }
  
  const config = {
    headers,
    ...options
  };
  
  console.log('Final config:', config); // Debugging

  try {
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status); // Debugging
    console.log('Response headers:', response.headers); // Debugging
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error data:', errorData); // Debugging
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    // Return JSON for non-204 responses
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

export default apiRequest;