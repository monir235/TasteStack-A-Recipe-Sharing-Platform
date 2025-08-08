import apiRequest from './api';
import * as mockApi from './mockApi';

// Flag to determine if we should use mock API
const USE_MOCK_API = false; // Set to false when backend is available

// Get user dashboard statistics
export const getDashboardStats = async () => {
  if (USE_MOCK_API) {
    // Return mock data for dashboard stats
    return {
      total_recipes: 12,
      total_likes: 124,
      total_comments: 42,
      followers_count: 56,
      following_count: 23
    };
  }
  
  return apiRequest('/auth/dashboard-stats/');
};

// Get user's own recipes for dashboard
export const getUserRecipes = async (page = 1, pageSize = 12) => {
  if (USE_MOCK_API) {
    return mockApi.getRecipesByAuthor(1, page, pageSize);
  }
  
  return apiRequest(`/recipes/my-recipes/?page=${page}&page_size=${pageSize}`);
};

// Delete a recipe (user can only delete their own recipes)
export const deleteRecipe = async (recipeId) => {
  if (USE_MOCK_API) {
    return mockApi.deleteRecipe(recipeId);
  }
  
  return apiRequest(`/recipes/${recipeId}/`, {
    method: 'DELETE'
  });
};

// Hide a comment on user's recipe
export const hideComment = async (recipeId, commentId) => {
  if (USE_MOCK_API) {
    return mockApi.hideComment(recipeId, commentId);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/comments/${commentId}/hide/`, {
    method: 'POST'
  });
};

// Delete a comment on user's recipe
export const deleteComment = async (recipeId, commentId) => {
  if (USE_MOCK_API) {
    return mockApi.deleteComment(recipeId, commentId);
  }
  
  return apiRequest(`/interactions/recipes/${recipeId}/comments/${commentId}/delete/`, {
    method: 'DELETE'
  });
};

// Get comments on user's recipes for moderation
export const getCommentsOnMyRecipes = async () => {
  if (USE_MOCK_API) {
    return {
      comments: [
        {
          id: 1,
          content: "Great recipe! Love the flavors.",
          user: { id: 2, username: "foodlover", name: "Food Lover" },
          recipe: { id: 1, title: "Delicious Pasta" },
          hidden: false,
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          content: "Could use more spices in my opinion.",
          user: { id: 3, username: "spicefan", name: "Spice Fan" },
          recipe: { id: 2, title: "Mild Curry" },
          hidden: false,
          created_at: "2024-01-14T15:45:00Z"
        }
      ]
    };
  }
  
  return apiRequest('/interactions/comments/my-recipes/');
};

// Get user's recent activity
export const getRecentActivity = async () => {
  if (USE_MOCK_API) {
    return {
      activities: [
        {
          type: 'recipe_created',
          message: 'You created a new recipe: "Chocolate Cake"',
          timestamp: '2024-01-15T12:00:00Z'
        },
        {
          type: 'recipe_liked',
          message: 'Your recipe "Pasta Carbonara" received 5 new likes',
          timestamp: '2024-01-14T18:30:00Z'
        },
        {
          type: 'comment_received',
          message: 'New comment on your recipe "Beef Stew"',
          timestamp: '2024-01-14T14:20:00Z'
        },
        {
          type: 'follower_gained',
          message: 'You gained 2 new followers',
          timestamp: '2024-01-13T09:15:00Z'
        }
      ]
    };
  }
  
  return apiRequest('/auth/recent-activity/');
};
