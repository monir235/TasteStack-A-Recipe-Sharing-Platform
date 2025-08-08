import apiRequest from './api';
import * as mockApi from './mockApi';

// Flag to determine if we should use mock API
const USE_MOCK_API = false; // Set to false when backend is available

// Get all recipes with optional pagination
export const getRecipes = async (page = 1, pageSize = 12) => {
  if (USE_MOCK_API) {
    return mockApi.getRecipes(page, pageSize);
  }
  
  return apiRequest(`/recipes/?page=${page}&page_size=${pageSize}`);
};

// Get a specific recipe by ID
export const getRecipe = async (id) => {
  if (USE_MOCK_API) {
    return mockApi.getRecipe(id);
  }
  
  return apiRequest(`/recipes/${id}/`);
};

// Create a new recipe
export const createRecipe = async (recipeData) => {
  if (USE_MOCK_API) {
    return mockApi.createRecipe(recipeData);
  }
  
  console.log('Creating recipe with data:', recipeData); // Debugging
  
  // Handle file upload by creating FormData
  const formData = new FormData();
  
  // Add all fields to formData with correct field names
  Object.keys(recipeData).forEach(key => {
    if (key === 'image' && recipeData[key]) {
      // Handle file upload
      formData.append(key, recipeData[key]);
    } else if (key === 'ingredients' || key === 'instructions') {
      // Convert arrays to JSON strings
      formData.append(key, JSON.stringify(recipeData[key]));
    } else if (recipeData[key] !== null && recipeData[key] !== undefined) {
      // Map frontend field names to backend field names
      let backendKey = key;
      if (key === 'prepTime') {
        backendKey = 'prep_time';
      } else if (key === 'cookTime') {
        backendKey = 'cook_time';
      }
      formData.append(backendKey, recipeData[key]);
    }
  });
  
  console.log('FormData being sent:', formData); // Debugging
  
  return apiRequest('/recipes/', {
    method: 'POST',
    body: formData
  }, true); // Pass true to indicate this is a FormData request
};

// Update an existing recipe
export const updateRecipe = async (id, recipeData) => {
  if (USE_MOCK_API) {
    return mockApi.updateRecipe(id, recipeData);
  }
  
  // Handle file upload by creating FormData
  const formData = new FormData();
  
  // Add all fields to formData with correct field names
  Object.keys(recipeData).forEach(key => {
    if (key === 'image' && recipeData[key]) {
      // Handle file upload
      formData.append(key, recipeData[key]);
    } else if (key === 'ingredients' || key === 'instructions') {
      // Convert arrays to JSON strings
      formData.append(key, JSON.stringify(recipeData[key]));
    } else if (recipeData[key] !== null && recipeData[key] !== undefined) {
      // Map frontend field names to backend field names
      let backendKey = key;
      if (key === 'prepTime') {
        backendKey = 'prep_time';
      } else if (key === 'cookTime') {
        backendKey = 'cook_time';
      }
      formData.append(backendKey, recipeData[key]);
    }
  });
  
  return apiRequest(`/recipes/${id}/`, {
    method: 'PUT',
    body: formData
  }, true); // Pass true to indicate this is a FormData request
};

// Delete a recipe
export const deleteRecipe = async (id) => {
  if (USE_MOCK_API) {
    return mockApi.deleteRecipe(id);
  }
  
  return apiRequest(`/recipes/${id}/`, {
    method: 'DELETE'
  });
};

// Search recipes with advanced filters
export const searchRecipes = async (query, page = 1, pageSize = 12, filters = {}) => {
  if (USE_MOCK_API) {
    return mockApi.searchRecipes(query, page, pageSize);
  }
  
  const params = new URLSearchParams();
  
  if (query) {
    params.append('q', query);
  }
  
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());
  
  // Add additional filter parameters
  if (filters.category) {
    params.append('category', filters.category);
  }
  
  if (filters.difficulty) {
    params.append('difficulty', filters.difficulty);
  }
  
  if (filters.maxTime) {
    params.append('max_time', filters.maxTime.toString());
  }
  
  if (filters.ingredients) {
    params.append('ingredients', filters.ingredients);
  }
  
  if (filters.author) {
    params.append('author', filters.author);
  }
  
  if (filters.minRating) {
    params.append('min_rating', filters.minRating.toString());
  }
  
  return apiRequest(`/recipes/search/?${params.toString()}`);
};

// Simple search for navbar (backward compatibility)
export const simpleSearchRecipes = async (query, page = 1, pageSize = 6) => {
  return searchRecipes(query, page, pageSize);
};

// Get recipes by author
export const getRecipesByAuthor = async (authorId, page = 1, pageSize = 12) => {
  if (USE_MOCK_API) {
    return mockApi.getRecipesByAuthor(authorId, page, pageSize);
  }
  
  return apiRequest(`/recipes/?author=${authorId}&page=${page}&page_size=${pageSize}`);
};

// Rate a recipe
export const rateRecipe = async (recipeId, rating) => {
  if (USE_MOCK_API) {
    return mockApi.rateRecipe(recipeId, rating);
  }
  
  return apiRequest(`/recipes/${recipeId}/rate/`, {
    method: 'POST',
    body: JSON.stringify({ rating })
  });
};

// Like a recipe
export const likeRecipe = async (recipeId) => {
  if (USE_MOCK_API) {
    return mockApi.likeRecipe(recipeId);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/like/`, {
    method: 'POST'
  });
};

// Unlike a recipe
export const unlikeRecipe = async (recipeId) => {
  if (USE_MOCK_API) {
    return mockApi.unlikeRecipe(recipeId);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/unlike/`, {
    method: 'POST'
  });
};

// Add a comment to a recipe
export const addComment = async (recipeId, comment) => {
  if (USE_MOCK_API) {
    return mockApi.addComment(recipeId, comment);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/comments/add/`, {
    method: 'POST',
    body: JSON.stringify({ content: comment })
  });
};

// Get comments for a recipe
export const getComments = async (recipeId) => {
  if (USE_MOCK_API) {
    return mockApi.getComments(recipeId);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/comments/`);
};


// Edit a comment on a recipe
export const editComment = async (recipeId, commentId, content) => {
  if (USE_MOCK_API) {
    return mockApi.editComment(recipeId, commentId, content);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/comments/${commentId}/edit/`, {
    method: 'PUT',
    body: JSON.stringify({ content })
  });
};

// Hide a comment on a recipe
export const hideComment = async (recipeId, commentId) => {
  if (USE_MOCK_API) {
    return mockApi.hideComment(recipeId, commentId);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/comments/${commentId}/hide/`, {
    method: 'POST'
  });
};

// Delete a comment from a recipe
export const deleteComment = async (recipeId, commentId) => {
  if (USE_MOCK_API) {
    return mockApi.deleteComment(recipeId, commentId);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/comments/${commentId}/delete/`, {
    method: 'DELETE'
  });
};