// Minimal i18n implementation
const translations = {
  // Dashboard
  'welcome_back': 'Welcome back',
  'chef': 'Chef',
  'manage_recipes': 'Manage your recipes, track your progress, and connect with the culinary community',
  'something_went_wrong': 'Something went wrong',
  'overview': '📊 Overview',
  'my_recipes': '🍽️ My Recipes',
  'profile': '👤 Profile',
  'activity': '⚡ Activity',
  'total_recipes': 'Total Recipes',
  'total_likes': 'Total Likes',
  'comments': 'Comments',
  'followers': 'Followers',
  'quick_actions': 'Quick Actions',
  'create_recipe': 'Create Recipe',
  'share_culinary_creation': 'Share your culinary creation',
  'manage_recipes_action': 'Manage Recipes',
  'edit_recipe_collection': 'Edit your recipe collection',
  'view_activity': 'View Activity',
  'track_progress': 'Track your progress',
  'manage_edit_collection': 'Manage and edit your recipe collection',
  'create_new_recipe': 'Create New Recipe',
  'no_recipes_yet': 'You haven\'t created any recipes yet.',
  'create_first_recipe': 'Create Your First Recipe',
  'my_profile': 'My Profile',
  'complete_profile_overview': 'Your complete profile overview',
  'personal_information': 'Personal Information',
  'additional_details': 'Additional Details',
  'your_statistics': 'Your Statistics',
  'recent_activity': 'Recent Activity',
  'no_recent_activity': 'No recent activity to show.',
  
  // Recipe Search
  'explore': 'Explore',
  'recipes': 'Recipes',
  'found_recipes': 'Found {count} amazing recipe{plural} for you',
  'discover_recipes': 'Discover delicious recipes from our amazing community of food lovers',
  'clear_all_filters': 'Clear All Filters',
  'refine_search': 'Refine Search',
  'find_perfect_recipe': 'Find your perfect recipe',
  'quick_search': '🔍 Quick Search',
  'category': 'Category',
  'difficulty': 'Difficulty',
  'maximum_time': 'Maximum Time',
  'author': 'Author',
  'minimum_rating': 'Minimum Rating',
  'search_by_chef': 'Search by chef name...',
  'no_recipes_found': 'No recipes found',
  'adjust_search_terms': 'Try adjusting your search terms or filters to find what you\'re looking for.',
  'previous': 'Previous',
  'next': 'Next',
  
  // Recipe Detail
  'edit_recipe': 'Edit Recipe',
  'like': 'Like',
  'liked': 'Liked',
  'no_image_available': 'No image available',
  'prep_time': 'Prep Time',
  'cook_time': 'Cook Time',
  'servings': 'Servings',
  'categories': 'Categories',
  'description': 'Description',
  'no_description': 'No description available',
  'ingredients': 'Ingredients',
  'no_ingredients': 'No ingredients listed',
  'instructions': 'Instructions',
  'no_instructions': 'No instructions provided',
  'rate_recipe': 'Rate this Recipe',
  'your_rating': 'Your Rating:',
  'add_comment': 'Add a comment...',
  'post_comment': 'Post Comment',
  'save': 'Save',
  'cancel': 'Cancel',
  'edit': 'Edit',
  'delete': 'Delete',
  'hide': 'Hide',
  'comment_hidden': 'This comment has been hidden by the recipe owner.',
  'no_comment_content': 'No comment content',
  
  // Recipe List
  'all_recipes': 'All Recipes',
  'browse_by_category': 'Browse by Category',
  'by_unknown': 'By Unknown',
  'recipe_image': 'Recipe Image',
  'view_all_categories': 'View All Categories →',
  
  // Common
  'loading': 'Loading...',
  'error': 'Error',
  'search': 'Search',
  'filter': 'Filter',
  'clear': 'Clear',
  'apply': 'Apply',
  'close': 'Close',
  'view': 'View',
  'view_recipe': 'View Recipe',
  
  // Additional missing translations
  'please_login_dashboard': 'Please log in to view your dashboard',
  'login': 'Login',
  'prep': 'Prep',
  'cook': 'Cook',
  'serves': 'Serves',
  'mins': 'mins',
  'view': 'View',
  'edit': 'Edit',
  'delete': 'Delete',
  'edit_profile': 'Edit Profile',
  'full_name': 'Full Name',
  'email': 'Email',
  'username': 'Username',
  'bio': 'Bio',
  'location': 'Location',
  'website': 'Website',
  'not_provided': 'Not provided',
  'no_bio_provided': 'No bio provided',
  'visit_website': 'Visit Website',
  'no_photo': 'No Photo',
  'user': 'User',
  'recipes_lowercase': 'recipes',
  'likes': 'likes',
  'comments_lowercase': 'comments',
  'followers_lowercase': 'followers',
  
  // Error messages and dialogs
  'user_info_not_available': 'User information not available',
  'failed_fetch_dashboard': 'Failed to fetch dashboard data',
  'confirm_delete_recipe': 'Are you sure you want to delete this recipe? This action cannot be undone.',
  'failed_delete_recipe': 'Failed to delete recipe. Please try again.',
  
  // Additional missing strings from DashboardPage
  'member_since': 'Member since',
  'joined': 'Joined',
  'account_created': 'Account created',
  'date_joined': 'Date joined',
  'member_for': 'Member for',
  'days': 'days',
  'months': 'months',
  'years': 'years',
  'ago': 'ago',
  'today': 'today',
  'yesterday': 'yesterday',
  'last_seen': 'Last seen',
  'online': 'Online',
  'offline': 'Offline',
  'status': 'Status',
  'active': 'Active',
  'inactive': 'Inactive'
};

export const t = (key, params = {}) => {
  let text = translations[key] || key;
  
  // Simple parameter replacement
  Object.keys(params).forEach(param => {
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
  });
  
  return text;
};

export default { t };