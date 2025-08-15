// Input validation utilities

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate recipe form data
export const validateRecipeForm = (formData) => {
  const errors = {};
  
  if (!formData.title || formData.title.trim().length === 0) {
    errors.title = 'Recipe title is required';
  }
  
  if (!formData.description || formData.description.trim().length === 0) {
    errors.description = 'Recipe description is required';
  }
  
  if (!formData.ingredients || formData.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required';
  }
  
  if (!formData.instructions || formData.instructions.length === 0) {
    errors.instructions = 'At least one instruction is required';
  }
  
  if (!formData.prepTime || formData.prepTime <= 0) {
    errors.prepTime = 'Preparation time must be greater than 0';
  }
  
  if (!formData.cookTime || formData.cookTime <= 0) {
    errors.cookTime = 'Cooking time must be greater than 0';
  }
  
  if (!formData.servings || formData.servings <= 0) {
    errors.servings = 'Servings must be greater than 0';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate search query
export const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return { isValid: false, error: 'Search query must be a string' };
  }
  
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length === 0) {
    return { isValid: false, error: 'Search query cannot be empty' };
  }
  
  if (trimmedQuery.length < 2) {
    return { isValid: false, error: 'Search query must be at least 2 characters long' };
  }
  
  if (trimmedQuery.length > 100) {
    return { isValid: false, error: 'Search query cannot exceed 100 characters' };
  }
  
  return { isValid: true, query: trimmedQuery };
};

// Rate limiter for search requests
export const searchRateLimiter = {
  requests: [],
  maxRequests: 10,
  timeWindow: 60000, // 1 minute
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    return this.requests.length < this.maxRequests;
  },
  
  recordRequest() {
    this.requests.push(Date.now());
  }
};

// Search history management
export const searchHistory = {
  maxHistory: 10,
  
  getHistory() {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  },
  
  addToHistory(query) {
    const history = this.getHistory();
    const filtered = history.filter(item => item !== query);
    filtered.unshift(query);
    const trimmed = filtered.slice(0, this.maxHistory);
    localStorage.setItem('searchHistory', JSON.stringify(trimmed));
  },
  
  clearHistory() {
    localStorage.removeItem('searchHistory');
  }
};

// Sanitize search input
export const sanitizeSearchInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>"'&]/g, '');
};