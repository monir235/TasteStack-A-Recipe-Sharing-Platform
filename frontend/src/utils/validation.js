// Input validation and sanitization utilities

// Sanitize search input to prevent XSS and other security issues
export const sanitizeSearchInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially harmful characters and HTML tags
  return input
    .replace(/[<>\"'&]/g, '') // Remove HTML special characters
    .replace(/[{}[\]]/g, '') // Remove bracket characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .trim()
    .substring(0, 100); // Limit length to 100 characters
};

// Validate search query
export const validateSearchQuery = (query) => {
  const errors = [];
  
  if (!query || typeof query !== 'string') {
    errors.push('Search query must be a string');
    return { isValid: false, errors };
  }
  
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length === 0) {
    errors.push('Search query cannot be empty');
  }
  
  if (trimmedQuery.length < 2) {
    errors.push('Search query must be at least 2 characters long');
  }
  
  if (trimmedQuery.length > 100) {
    errors.push('Search query cannot exceed 100 characters');
  }
  
  // Check for suspicious patterns
  if (/[<>\"'&]/.test(trimmedQuery)) {
    errors.push('Search query contains invalid characters');
  }
  
  if (/javascript:|data:|vbscript:/i.test(trimmedQuery)) {
    errors.push('Search query contains prohibited content');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: sanitizeSearchInput(query)
  };
};

// Validate recipe ID
export const validateRecipeId = (id) => {
  if (!id) return { isValid: false, error: 'Recipe ID is required' };
  
  const numId = parseInt(id, 10);
  if (isNaN(numId) || numId <= 0) {
    return { isValid: false, error: 'Invalid recipe ID' };
  }
  
  return { isValid: true, id: numId };
};

// Sanitize and validate URL parameters
export const sanitizeUrlParams = (params) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value && typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue.length > 0) {
        sanitized[key] = sanitizeSearchInput(trimmedValue);
      }
    }
  }
  
  return sanitized;
};

// Rate limiting helper for search requests
export class SearchRateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) { // 10 requests per minute
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // Check if we can make a new request
    if (this.requests.length >= this.maxRequests) {
      return {
        allowed: false,
        resetTime: this.requests[0] + this.timeWindow
      };
    }
    
    // Add current request
    this.requests.push(now);
    
    return { allowed: true };
  }
  
  getRemainingTime() {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const resetTime = oldestRequest + this.timeWindow;
    return Math.max(0, resetTime - Date.now());
  }
}

// Create global rate limiter instance
export const searchRateLimiter = new SearchRateLimiter();

// Debounce utility for search
export const createDebouncer = (func, delay) => {
  let timeoutId;
  
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
  
  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };
  
  return debounced;
};

// Search history management
export class SearchHistory {
  constructor(maxItems = 10) {
    this.maxItems = maxItems;
    this.storageKey = 'searchHistory';
  }
  
  getHistory() {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.warn('Failed to load search history:', error);
      return [];
    }
  }
  
  addSearch(query) {
    if (!query || typeof query !== 'string') return;
    
    const sanitized = sanitizeSearchInput(query);
    if (sanitized.length < 2) return;
    
    try {
      let history = this.getHistory();
      
      // Remove duplicate if exists
      history = history.filter(item => item !== sanitized);
      
      // Add to beginning
      history.unshift(sanitized);
      
      // Limit size
      history = history.slice(0, this.maxItems);
      
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }
  
  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear search history:', error);
    }
  }
}

// Create global search history instance
export const searchHistory = new SearchHistory();
