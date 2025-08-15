import apiRequest from './api';

// Get user dashboard statistics
export const getDashboardStats = async () => {
  return apiRequest('/auth/dashboard-stats/');
};

// Get user's own recipes for dashboard
export const getUserRecipes = async (page = 1, pageSize = 12) => {
  return apiRequest(`/recipes/my-recipes/?page=${page}&page_size=${pageSize}`);
};

// Delete a recipe (user can only delete their own recipes)
export const deleteRecipe = async (recipeId) => {
  return apiRequest(`/recipes/${recipeId}/`, {
    method: 'DELETE'
  });
};

// Hide a comment on user's recipe
export const hideComment = async (recipeId, commentId) => {
  return apiRequest(`/interactions/recipes/${recipeId}/comments/${commentId}/hide/`, {
    method: 'POST'
  });
};

// Delete a comment on user's recipe
export const deleteComment = async (recipeId, commentId) => {
  return apiRequest(`/interactions/recipes/${recipeId}/comments/${commentId}/delete/`, {
    method: 'DELETE'
  });
};

// Get comments on user's recipes for moderation
export const getCommentsOnMyRecipes = async () => {
  return apiRequest('/interactions/comments/my-recipes/');
};

// Get user's recent activity
export const getRecentActivity = async () => {
  return apiRequest('/auth/recent-activity/');
};
