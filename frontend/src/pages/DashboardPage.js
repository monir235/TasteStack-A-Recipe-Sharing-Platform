import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getRecipesByAuthor, deleteRecipe as deleteRecipeService } from '../services/recipeService';
import { getDashboardStats, getRecentActivity } from '../services/dashboardService';
import { t } from '../utils/i18n';

const StatsCard = ({ title, value, icon, gradient }) => (
  <div className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
      <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center`}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

const QuickActionCard = ({ to, onClick, icon, title, subtitle, primary = false }) => {
  const baseClasses = "group flex flex-col items-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105";
  const primaryClasses = "bg-gradient-to-r from-violet-500 to-purple-500 text-white";
  const secondaryClasses = "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600";
  
  const content = (
    <>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
        primary ? 'bg-white/20 group-hover:bg-white/30' : 'bg-violet-100 dark:bg-violet-800 group-hover:bg-violet-200 dark:group-hover:bg-violet-700'
      }`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="font-semibold">{title}</span>
      <span className={`text-sm mt-1 ${primary ? 'opacity-90' : 'text-gray-500 dark:text-gray-400'}`}>{subtitle}</span>
    </>
  );

  return to ? (
    <Link to={to} className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}>
      {content}
    </button>
  );
};

const getMediaUrl = () => process.env.REACT_APP_MEDIA_URL || 'http://localhost:8000';

const RecipeCard = ({ recipe, onDelete }) => {
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {recipe.image ? (
          <img 
            src={recipe.image.startsWith('/') ? `${getMediaUrl()}${recipe.image}` : recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{recipe.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{t('prep')}: {recipe.prep_time} {t('mins')}</span>
          <span>{t('cook')}: {recipe.cook_time} {t('mins')}</span>
          <span>{t('serves')}: {recipe.servings}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center">
              <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {recipe.likes_count || 0}
            </span>
          </div>
          <div className="flex space-x-2">
            <Link to={`/recipes/${recipe.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
              {t('view')}
            </Link>
            <Link to={`/edit-recipe/${recipe.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
              {t('edit')}
            </Link>
            <button onClick={() => onDelete(recipe.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">
              {t('delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({ user, stats }) => {
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl p-8 mb-8">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-violet-300 to-purple-300 dark:from-violet-600 dark:to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-r from-indigo-300 to-violet-300 dark:from-indigo-600 dark:to-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {t('my_profile')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t('complete_profile_overview')}</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl overflow-hidden rounded-2xl border border-white/20 dark:border-gray-700/20">
          <div className="px-8 py-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-8">
              <div className="flex-shrink-0">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-800 dark:to-purple-800 flex items-center justify-center relative overflow-hidden border-4 border-white dark:border-gray-600 shadow-lg">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture.startsWith('/') ? `${getMediaUrl()}${user.profile_picture}` : user.profile_picture}
                      alt={user.username}
                      className="w-full h-full object-contain rounded-full bg-gray-100"
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-12 h-12 text-violet-300 dark:text-violet-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-violet-400 dark:text-violet-500 text-xs font-medium">{t('no_photo')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {user?.first_name || user?.last_name 
                    ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
                    : user?.username || t('user')
                  }
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">@{user?.username}</p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{user?.email}</p>
                
                <div className="flex justify-center md:justify-start">
                  <Link
                    to="/edit-profile"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    {t('edit_profile')}
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {t('personal_information')}
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('full_name')}</label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {user?.first_name || user?.last_name 
                        ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
                        : t('not_provided')
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
                    <p className="text-gray-900 dark:text-gray-100">{user?.email || t('not_provided')}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('username')}</label>
                    <p className="text-gray-900 dark:text-gray-100">@{user?.username || t('not_provided')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {t('additional_details')}
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('bio')}</label>
                    <p className="text-gray-900 dark:text-gray-100">{user?.bio || t('no_bio_provided')}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location')}</label>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center">
                      {user?.location ? (
                        <>
                          <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {user.location}
                        </>
                      ) : t('not_provided')}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('website')}</label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {user?.website ? (
                        <a 
                          href={user.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          {t('visit_website')}
                        </a>
                      ) : t('not_provided')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                {t('your_statistics')}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.total_recipes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('recipes_lowercase')}</div>
                </div>
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.total_likes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('likes')}</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total_comments}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('comments_lowercase')}</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.followers_count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('followers_lowercase')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState({
    total_recipes: 0,
    total_likes: 0,
    total_comments: 0,
    followers_count: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      setError(t('user_info_not_available'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const [statsResult, activityResult, recipesResult] = await Promise.allSettled([
        getDashboardStats(),
        getRecentActivity(),
        getRecipesByAuthor(user.id)
      ]);

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      } else {
        console.warn('Failed to load stats:', statsResult.reason);
      }
      
      if (activityResult.status === 'fulfilled') {
        setRecentActivity(activityResult.value.activities || []);
      } else {
        console.warn('Failed to load activity:', activityResult.reason);
      }
      
      if (recipesResult.status === 'fulfilled') {
        setRecipes(recipesResult.value.results || []);
      } else {
        console.warn('Failed to load recipes:', recipesResult.reason);
      }
      
    } catch (err) {
      setError(`${t('failed_fetch_dashboard')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user, fetchDashboardData]);
  
  const handleDeleteRecipe = useCallback(async (recipeId) => {
    if (!window.confirm(t('confirm_delete_recipe'))) return;
    
    try {
      await deleteRecipeService(recipeId);
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setStats(prev => ({ ...prev, total_recipes: prev.total_recipes - 1 }));
    } catch (error) {
      console.error('Delete recipe failed:', error);
      setError(`${t('failed_delete_recipe')}: ${error.message || error}`);
    }
  }, []);
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('please_login_dashboard')}</h1>
          <Link to="/login" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            {t('login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            {t('welcome_back')}, <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{user?.first_name || user?.username || t('chef')}</span>!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('manage_recipes')}
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        )}
      
        {error && (
          <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">{t('something_went_wrong')}</h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

      {!loading && !error && (
        <>
          <div className="mb-12">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20 dark:border-gray-700/20 shadow-lg">
              <nav className="flex space-x-2">
                {[
                  { key: 'overview', label: t('overview') },
                  { key: 'recipes', label: t('my_recipes') },
                  { key: 'profile', label: t('profile') },
                  { key: 'activity', label: t('activity') }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                <StatsCard title={t('total_recipes')} value={stats.total_recipes} icon="🍽️" gradient="bg-gradient-to-r from-violet-500 to-purple-500" />
                <StatsCard title={t('total_likes')} value={stats.total_likes} icon="❤️" gradient="bg-gradient-to-r from-rose-500 to-pink-500" />
                <StatsCard title={t('comments')} value={stats.total_comments} icon="💬" gradient="bg-gradient-to-r from-blue-500 to-cyan-500" />
                <StatsCard title={t('followers')} value={stats.followers_count} icon="👥" gradient="bg-gradient-to-r from-green-500 to-emerald-500" />
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">{t('quick_actions')}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <QuickActionCard 
                    to="/create-recipe" 
                    icon="✨" 
                    title={t('create_recipe')} 
                    subtitle={t('share_culinary_creation')} 
                    primary 
                  />
                  <QuickActionCard 
                    onClick={() => setActiveTab('recipes')} 
                    icon="📚" 
                    title={t('manage_recipes_action')} 
                    subtitle={t('edit_recipe_collection')} 
                  />
                  <QuickActionCard 
                    onClick={() => setActiveTab('activity')} 
                    icon="⚡" 
                    title={t('view_activity')} 
                    subtitle={t('track_progress')} 
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'recipes' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('my_recipes')}</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{t('manage_edit_collection')}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link
                    to="/create-recipe"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {t('create_new_recipe')}
                  </Link>
                </div>
              </div>

              {recipes.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{t('no_recipes_yet')}</p>
                  <Link
                    to="/create-recipe"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {t('create_first_recipe')}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDeleteRecipe} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileSection user={user} stats={stats} />
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('recent_activity')}</h2>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                {recentActivity.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{t('no_recent_activity')}</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentActivity.map((activity, index) => (
                      <li key={index} className="p-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default DashboardPage;