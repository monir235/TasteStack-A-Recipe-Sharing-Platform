import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchRecipes } from '../services/recipeService';
import { useTheme } from '../contexts/ThemeContext';
import { t } from '../utils/i18n';

const RecipeSearchPage = () => {
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
  const [maxTime, setMaxTime] = useState(searchParams.get('max_time') || '');

  const [authorFilter, setAuthorFilter] = useState(searchParams.get('author') || '');
  const [minRatingFilter, setMinRatingFilter] = useState(searchParams.get('min_rating') || '');

  const categories = [
    { name: 'All Categories', value: '' },
    { name: 'Breakfast', value: 'breakfast' },
    { name: 'Lunch', value: 'lunch' },
    { name: 'Dinner', value: 'dinner' },
    { name: 'Desserts', value: 'desserts' },
    { name: 'Appetizers', value: 'appetizers' },
    { name: 'Snacks', value: 'snacks' },
    { name: 'Italian', value: 'italian' },
    { name: 'Asian', value: 'asian' },
    { name: 'Mexican', value: 'mexican' },
    { name: 'Indian', value: 'indian' },
    { name: 'Mediterranean', value: 'mediterranean' },
    { name: 'American', value: 'american' },
    { name: 'Vegetarian', value: 'vegetarian' },
    { name: 'Vegan', value: 'vegan' },
    { name: 'Gluten-Free', value: 'gluten-free' },
    { name: 'Keto', value: 'keto' },
    { name: 'Healthy', value: 'healthy' },
    { name: 'Quick & Easy', value: 'quick' },
  ];

  const difficulties = [
    { name: 'Any Difficulty', value: '' },
    { name: 'Easy', value: 'Easy' },
    { name: 'Medium', value: 'Medium' },
    { name: 'Hard', value: 'Hard' },
  ];

  const timeOptions = [
    { name: 'Any Time', value: '' },
    { name: 'Under 15 mins', value: '15' },
    { name: 'Under 30 mins', value: '30' },
    { name: 'Under 1 hour', value: '60' },
    { name: 'Under 2 hours', value: '120' },
  ];

  const ratingOptions = [
    { name: 'Any Rating', value: '' },
    { name: '4+ Stars', value: '4' },
    { name: '3+ Stars', value: '3' },
    { name: '2+ Stars', value: '2' },
    { name: '1+ Stars', value: '1' },
  ];

  // Fetch recipes based on current filters
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError('');
      
      try {
        const filters = {};
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedDifficulty) filters.difficulty = selectedDifficulty;
        if (maxTime) filters.maxTime = parseInt(maxTime);
        if (authorFilter) filters.author = authorFilter;
        if (minRatingFilter) filters.minRating = parseFloat(minRatingFilter);

        const response = await searchRecipes(searchQuery, currentPage, 12, filters);
        
        setRecipes(response.results || []);
        setTotalResults(response.count || 0);
        setTotalPages(response.total_pages || 1);
        
      } catch (err) {
        setError('Failed to search recipes');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchQuery, selectedCategory, selectedDifficulty, maxTime, authorFilter, minRatingFilter, currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
    if (maxTime) params.set('max_time', maxTime);
    if (authorFilter) params.set('author', authorFilter);
    if (minRatingFilter) params.set('min_rating', minRatingFilter);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedDifficulty, maxTime, authorFilter, minRatingFilter, currentPage, setSearchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setMaxTime('');
    setAuthorFilter('');
    setMinRatingFilter('');
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory) count++;
    if (selectedDifficulty) count++;
    if (maxTime) count++;
    if (authorFilter) count++;
    if (minRatingFilter) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-32 right-10 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>
      
      {/* Header */}
      <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              {t('explore')} <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{t('recipes')}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              {totalResults > 0 ? (
                t('found_recipes', { count: totalResults, plural: totalResults !== 1 ? 's' : '' })
              ) : (
                t('discover_recipes')
              )}
            </p>
            
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-violet-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {t('clear_all_filters')} ({getActiveFiltersCount()})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-8 space-y-8 sticky top-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('refine_search')}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{t('find_perfect_recipe')}</p>
              </div>
              
              {/* Search Input */}
              <div>
                <label htmlFor="search" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  {t('quick_search')}
                </label>
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative group">
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search recipes, ingredients..."
                      className="block w-full pl-12 pr-4 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 group-hover:shadow-lg dark:text-gray-100"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </form>
              </div>

              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('category')}
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-violet-500 focus:border-violet-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('difficulty')}
                </label>
                <select
                  id="difficulty"
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-violet-500 focus:border-violet-500"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Time Filter */}
              <div>
                <label htmlFor="maxTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('maximum_time')}
                </label>
                <select
                  id="maxTime"
                  value={maxTime}
                  onChange={(e) => {
                    setMaxTime(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-violet-500 focus:border-violet-500"
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>



              {/* Author Filter */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('author')}
                </label>
                <input
                  type="text"
                  id="author"
                  value={authorFilter}
                  onChange={(e) => {
                    setAuthorFilter(e.target.value);
                    handleFilterChange();
                  }}
                  placeholder={t('search_by_chef')}
                  className="block w-full px-4 py-3 bg-white/60 dark:bg-gray-700/60 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm transition-all dark:text-gray-100"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('minimum_rating')}
                </label>
                <select
                  id="minRating"
                  value={minRatingFilter}
                  onChange={(e) => {
                    setMinRatingFilter(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-4 py-3 bg-white/60 dark:bg-gray-700/60 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm transition-all dark:text-gray-100"
                >
                  {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                {recipes.length > 0 ? (
                  <>
                    {/* Recipe Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {recipes.map((recipe) => (
                        <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="group block">
                          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-white/20 dark:border-gray-700/20">
                            <div className="relative overflow-hidden">
                              {recipe.image ? (
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  onError={(e) => {
                                    console.log('Image failed to load:', recipe.image);
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                  onLoad={() => console.log('Image loaded successfully:', recipe.image)}
                                />
                              ) : null}
                              <div className="h-56 bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 dark:from-violet-800 dark:via-purple-800 dark:to-pink-800 flex items-center justify-center" style={{display: recipe.image ? 'none' : 'flex'}}>
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="text-violet-600 dark:text-violet-400 font-semibold">Recipe Image</span>
                                </div>
                              </div>
                              {/* Floating Badges */}
                              <div className="absolute top-4 left-4">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-3 py-1 shadow-lg">
                                  <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-xs font-bold">{recipe.average_rating || '0.0'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute top-4 right-4">
                                <div className="bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full px-3 py-1 shadow-lg">
                                  <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-bold">{recipe.likes_count || 0}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-6">
                              <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-violet-600 transition-colors duration-300 line-clamp-2">
                                  {recipe.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                                  {recipe.description?.substring(0, 120) || 'Delicious recipe waiting for you to discover'}...
                                </p>
                              </div>
                              
                              {/* Author Info */}
                              <div className="flex items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {recipe.author?.name?.charAt(0) || recipe.author?.first_name?.charAt(0) || recipe.author?.username?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {recipe.author?.name || 
                                     (recipe.author?.first_name && recipe.author?.last_name ? 
                                       `${recipe.author.first_name} ${recipe.author.last_name}`.trim() : 
                                       recipe.author?.first_name || recipe.author?.username) || 
                                     'Unknown Chef'}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Recipe Creator</p>
                                </div>
                              </div>
                              
                              {/* Categories */}
                              {(() => {
                                if (!recipe.category || recipe.category === '[]' || !recipe.category.trim()) return null;
                                const categories = [...new Set(recipe.category.split(',').map(cat => cat.trim()).filter(cat => cat))];
                                if (categories.length === 0) return null;
                                return (
                                  <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                      {categories.slice(0, 3).map((cat, index) => (
                                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                                          {cat}
                                        </span>
                                      ))}
                                      {categories.length > 3 && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                          +{categories.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })()}
                              
                              {/* Recipe Stats */}
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-violet-600">{recipe.prep_time || 0}m</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Prep</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-orange-600">{recipe.cook_time || 0}m</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Cook</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-600">{recipe.servings || 0}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Serves</div>
                                </div>
                              </div>
                              
                              {/* Action Button */}
                              <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                  recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                  recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {recipe.difficulty}
                                </span>
                                <div className="flex items-center text-violet-600 group-hover:text-violet-700 font-semibold">
                                  <span className="text-sm mr-2">View Recipe</span>
                                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-12 flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('previous')}
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                                  currentPage === pageNum
                                    ? 'bg-violet-600 border-violet-600 text-white'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('next')}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-24 w-24 text-violet-300 dark:text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">{t('no_recipes_found')}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                      {t('adjust_search_terms')}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                      >
                        {t('clear_all_filters')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSearchPage;
