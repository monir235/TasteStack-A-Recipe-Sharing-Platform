const API_BASE_URL = 'http://localhost:8000/api';

export const getStatistics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/statistics/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Return fallback data with current year if API fails
    return {
      total_recipes: 0,
      total_users: 0,
      total_ratings: 0,
      total_likes: 0,
      total_comments: 0,
      founded_year: new Date().getFullYear(),
      platform_rating: 5.0,
      recent_recipes: 0,
      active_users: 0,
      happy_chefs: 0,
      recipes_shared: 0,
    };
  }
};
