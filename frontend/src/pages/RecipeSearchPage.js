import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchRecipes } from '../services/recipeService';

const RecipeSearchPage = () => {
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
  const [ingredientsFilter, setIngredientsFilter] = useState(searchParams.get('ingredients') || '');
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
        if (ingredientsFilter) filters.ingredients = ingredientsFilter;
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
  }, [searchQuery, selectedCategory, selectedDifficulty, maxTime, ingredientsFilter, authorFilter, minRatingFilter, currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
    if (maxTime) params.set('max_time', maxTime);
    if (ingredientsFilter) params.set('ingredients', ingredientsFilter);
    if (authorFilter) params.set('author', authorFilter);
    if (minRatingFilter) params.set('min_rating', minRatingFilter);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedDifficulty, maxTime, ingredientsFilter, authorFilter, minRatingFilter, currentPage, setSearchParams]);

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
    setIngredientsFilter('');
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
    if (ingredientsFilter) count++;
    if (authorFilter) count++;
    if (minRatingFilter) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Search Recipes</h1>
              <p className="mt-2 text-gray-600">
                {totalResults > 0 ? (
                  <>Found {totalResults} recipe{totalResults !== 1 ? 's' : ''}</>
                ) : (
                  'Discover delicious recipes from our community'
                )}
              </p>
            </div>
            
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters ({getActiveFiltersCount()})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              
              {/* Search Input */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Recipe name, ingredient, etc..."
                      className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </form>
              </div>

              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
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
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
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
                <label htmlFor="maxTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Time
                </label>
                <select
                  id="maxTime"
                  value={maxTime}
                  onChange={(e) => {
                    setMaxTime(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ingredients Filter */}
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Ingredients
                </label>
                <input
                  type="text"
                  id="ingredients"
                  value={ingredientsFilter}
                  onChange={(e) => {
                    setIngredientsFilter(e.target.value);
                    handleFilterChange();
                  }}
                  placeholder="e.g., chicken, tomato, cheese"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                />
                <p className="mt-1 text-xs text-gray-500">Separate multiple ingredients with commas</p>
              </div>

              {/* Author Filter */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  value={authorFilter}
                  onChange={(e) => {
                    setAuthorFilter(e.target.value);
                    handleFilterChange();
                  }}
                  placeholder="Search by chef name..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  id="minRating"
                  value={minRatingFilter}
                  onChange={(e) => {
                    setMinRatingFilter(e.target.value);
                    handleFilterChange();
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
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
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
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
                          <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100">
                            <div className="relative overflow-hidden">
                              {recipe.image ? (
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  onError={(e) => {
                                    console.log('Image failed to load:', recipe.image);
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                  onLoad={() => console.log('Image loaded successfully:', recipe.image)}
                                />
                              ) : null}
                              <div className="h-48 bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center" style={{display: recipe.image ? 'none' : 'flex'}}>
                                <div className="text-center">
                                  <svg className="w-12 h-12 text-violet-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-violet-400 font-medium">Recipe Image</span>
                                </div>
                              </div>
                              {/* Floating Badge */}
                              <div className="absolute top-4 left-4">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                                  <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-xs font-semibold text-gray-700">{recipe.average_rating || '0.0'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                                {recipe.title}
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-2">
                                {recipe.description?.substring(0, 100) || 'Delicious recipe waiting for you to discover'}...
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm text-gray-500">{recipe.likes_count || 0}</span>
                                </div>
                                
                                <div className="flex items-center text-violet-600 group-hover:text-violet-700 font-medium">
                                  <span className="text-sm mr-1">View Recipe</span>
                                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                              
                              {/* Recipe details */}
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">
                                    Ready in {(recipe.prep_time || 0) + (recipe.cook_time || 0)} mins
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                                    {recipe.difficulty}
                                  </span>
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
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
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
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-24 w-24 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-bold text-gray-900">No recipes found</h3>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                      >
                        Clear All Filters
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
