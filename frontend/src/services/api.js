// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic API request function with enhanced error handling and timeout
const apiRequest = async (endpoint, options = {}, isFormData = false) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth headers
  const authHeaders = getAuthHeaders();
  
  // Set default headers
  let headers = {
    ...authHeaders,
    ...options.headers
  };
  
  // Only set Content-Type to application/json if it's not a FormData request
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000); // 10 second default timeout
  
  const config = {
    headers,
    signal: controller.signal,
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }
    
    // Handle rate limiting
    if (response.status === 429) {
      const error = new Error('Too many requests. Please wait a moment.');
      error.status = 429;
      throw error;
    }
    
    // Handle server errors
    if (response.status >= 500) {
      let errorMessage = 'Server error. Please try again later.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // If response body is not JSON, use default message
      }
      const error = new Error(`${errorMessage} (${response.status})`);
      error.status = response.status;
      throw error;
    }
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // If response body is not JSON, create a generic error
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      
      // For 400 errors, try to extract meaningful error message
      if (response.status === 400) {
        if (errorData.error) {
          const error = new Error(errorData.error);
          error.status = 400;
          throw error;
        } else if (typeof errorData === 'object') {
          // Handle field-specific errors
          const errorMessages = [];
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages[0]}`);
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          }
          if (errorMessages.length > 0) {
            const error = new Error(errorMessages.join(', '));
            error.status = 400;
            error.fieldErrors = errorData;
            throw error;
          }
        }
      }
      
      const error = new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    // Return JSON for non-204 responses
    if (response.status === 204) {
      return null;
    }
    
    const data = await response.json();
    
    // Validate response data structure
    if (data === null || data === undefined) {
      throw new Error('Invalid response: empty data');
    }
    
    return data;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle different types of errors
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timed out');
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const networkError = new Error('Network connection failed');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
    
    // Re-throw the error with additional context
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export default apiRequest;