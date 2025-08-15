import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRecipesByAuthor, deleteRecipe as deleteRecipeService } from '../services/recipeService';
import { getDashboardStats, getRecentActivity } from '../services/dashboardService';
import { updateProfile } from '../services/authService';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
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
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profileUpdateData, setProfileUpdateData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    website: ''
  });
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user || !user.id) {
        console.log('User not available yet:', user);
        setError('User information not available');
        return;
      }
      
      console.log('Fetching dashboard data for user:', user.id);
      
      // Fetch all dashboard data concurrently
      const promises = [
        getDashboardStats(),
        getRecentActivity()
      ];
      
      // Only fetch recipes if we have a user ID
      if (user.id) {
        promises.push(getRecipesByAuthor(user.id));
      }
      
      const results = await Promise.all(promises);
      
      const [statsData, activityData, recipeData] = results;
      
      setStats(statsData);
      setRecentActivity(activityData.activities || []);
      
      if (recipeData) {
        setRecipes(recipeData.results || []);
      }
    } catch (err) {
      setError(`Failed to fetch dashboard data: ${err.message}`);
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileUpdate = async (updateData) => {
    try {
      await updateProfile(updateData);
      // Optionally refetch user data or update local state
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };
  
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      try {
        await deleteRecipeService(recipeId);
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
        // Update stats
        setStats(prev => ({ ...prev, total_recipes: prev.total_recipes - 1 }));
      } catch (error) {
        console.error('Failed to delete recipe:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to view your dashboard</h1>
          <Link to="/login" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Welcome back, <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{user?.first_name || user?.username || 'Chef'}</span>!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your recipes, track your progress, and connect with the culinary community
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
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-900">Something went wrong</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

      {!loading && !error && (
        <>
          {/* Modern Navigation Tabs */}
          <div className="mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'recipes'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  🍽️ My Recipes
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'activity'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  ⚡ Activity
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Modern Stats Section */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Recipes</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total_recipes}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🍽️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Likes</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total_likes}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">❤️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Comments</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total_comments}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Followers</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.followers_count}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Quick Actions */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Link
                    to="/create-recipe"
                    className="group flex flex-col items-center p-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                      <span className="text-2xl">✨</span>
                    </div>
                    <span className="font-semibold">Create Recipe</span>
                    <span className="text-sm opacity-90 mt-1">Share your culinary creation</span>
                  </Link>
                  
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="group flex flex-col items-center p-6 bg-white text-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-violet-200 transition-colors">
                      <span className="text-2xl">📚</span>
                    </div>
                    <span className="font-semibold">Manage Recipes</span>
                    <span className="text-sm text-gray-500 mt-1">Edit your recipe collection</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="group flex flex-col items-center p-6 bg-white text-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <span className="font-semibold">View Activity</span>
                    <span className="text-sm text-gray-500 mt-1">Track your progress</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'recipes' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Recipes</h2>
                  <p className="mt-1 text-gray-600">Manage and edit your recipe collection</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link
                    to="/create-recipe"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Recipe
                  </Link>
                </div>
              </div>

              {recipes.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500 mb-4">You haven't created any recipes yet.</p>
                  <Link
                    to="/create-recipe"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Your First Recipe
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        {recipe.image ? (
                          <img 
                            src={recipe.image.startsWith('/') ? `http://localhost:8000${recipe.image}` : recipe.image} 
                            alt={recipe.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Prep: {recipe.prep_time} mins</span>
                          <span>Cook: {recipe.cook_time} mins</span>
                          <span>Serves: {recipe.servings}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              {recipe.likes_count || 0}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/recipes/${recipe.id}`}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              View
                            </Link>
                            <Link
                              to={`/edit-recipe/${recipe.id}`}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {activeTab === 'profile' && (
            <div className="relative">
              {/* Profile View with Modern Design */}
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50 rounded-3xl p-8 mb-8">
                {/* Background Decoration */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-violet-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                  <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-r from-indigo-300 to-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                </div>
                
                <div className="relative">
                  {/* Profile Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                      My Profile
                    </h2>
                    <p className="text-lg text-gray-600">Your complete profile overview</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm shadow-2xl overflow-hidden rounded-2xl border border-white/20">
                    <div className="px-8 py-8">
                      {/* Profile Picture and Basic Info */}
                      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-8">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center relative overflow-hidden border-4 border-white shadow-lg">
                            {user?.profile_picture ? (
                              <img
                                src={user.profile_picture.startsWith('/') 
                                  ? `http://localhost:8000${user.profile_picture}` 
                                  : user.profile_picture}
                                alt={user.username}
                                className="w-full h-full object-contain rounded-full bg-gray-100"
                              />
                            ) : (
                              <div className="text-center">
                                <svg className="w-12 h-12 text-violet-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span className="text-violet-400 text-xs font-medium">No Photo</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Basic Info */}
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {user?.first_name || user?.last_name 
                              ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
                              : user?.username || 'User'
                            }
                          </h3>
                          <p className="text-lg text-gray-600 mb-2">@{user?.username}</p>
                          <p className="text-gray-500 mb-4">{user?.email}</p>
                          
                          {/* Action Button */}
                          <div className="flex justify-center md:justify-start">
                            <Link
                              to="/edit-profile"
                              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Edit Profile
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Profile Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Personal Information
                          </h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                              <p className="text-gray-900">
                                {user?.first_name || user?.last_name 
                                  ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
                                  : 'Not provided'
                                }
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                              <p className="text-gray-900">@{user?.username || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Additional Details
                          </h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                              <p className="text-gray-900">{user?.bio || 'No bio provided'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <p className="text-gray-900 flex items-center">
                                {user?.location ? (
                                  <>
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    {user.location}
                                  </>
                                ) : 'Not provided'}
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                              <p className="text-gray-900">
                                {user?.website ? (
                                  <a 
                                    href={user.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-violet-600 hover:text-violet-800 flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                    </svg>
                                    Visit Website
                                  </a>
                                ) : 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Section */}
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          Your Statistics
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-violet-50 rounded-xl text-center">
                            <div className="text-2xl font-bold text-violet-600">{stats.total_recipes}</div>
                            <div className="text-sm text-gray-600">Recipes</div>
                          </div>
                          <div className="p-4 bg-rose-50 rounded-xl text-center">
                            <div className="text-2xl font-bold text-rose-600">{stats.total_likes}</div>
                            <div className="text-sm text-gray-600">Likes</div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-xl text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.total_comments}</div>
                            <div className="text-sm text-gray-600">Comments</div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.followers_count}</div>
                            <div className="text-sm text-gray-600">Followers</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="bg-white shadow rounded-lg">
                {recentActivity.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No recent activity to show.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentActivity.map((activity, index) => (
                      <li key={index} className="p-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
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
