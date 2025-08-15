import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { simpleSearchRecipes } from '../services/recipeService';
import { 
  validateSearchQuery, 
  sanitizeSearchInput, 
  searchRateLimiter, 
  createDebouncer,
  searchHistory 
} from '../utils/validation';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const categoriesDropdownRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const searchAbortControllerRef = useRef(null);

  // Well-structured recipe categories
  const categoryGroups = {
    'Meal Type': [
      { name: 'Breakfast', icon: '🍳', slug: 'breakfast' },
      { name: 'Lunch', icon: '🥪', slug: 'lunch' },
      { name: 'Dinner', icon: '🍽️', slug: 'dinner' },
      { name: 'Desserts', icon: '🍰', slug: 'desserts' },
      { name: 'Appetizers', icon: '🥗', slug: 'appetizers' },
      { name: 'Snacks', icon: '🥨', slug: 'snacks' }
    ],
    'Cuisine': [
      { name: 'Italian', icon: '🍝', slug: 'italian' },
      { name: 'Asian', icon: '🍜', slug: 'asian' },
      { name: 'Mexican', icon: '🌮', slug: 'mexican' },
      { name: 'Indian', icon: '🍛', slug: 'indian' },
      { name: 'Mediterranean', icon: '🫒', slug: 'mediterranean' },
      { name: 'American', icon: '🍔', slug: 'american' }
    ],
    'Dietary': [
      { name: 'Vegetarian', icon: '🥬', slug: 'vegetarian' },
      { name: 'Vegan', icon: '🌱', slug: 'vegan' },
      { name: 'Gluten-Free', icon: '🌾', slug: 'gluten-free' },
      { name: 'Keto', icon: '🥑', slug: 'keto' },
      { name: 'Low-Carb', icon: '🥒', slug: 'low-carb' },
      { name: 'Dairy-Free', icon: '🥥', slug: 'dairy-free' }
    ],
    'Cooking Style': [
      { name: 'Quick & Easy', icon: '⚡', slug: 'quick' },
      { name: 'One-Pot', icon: '🍲', slug: 'one-pot' },
      { name: 'BBQ & Grilling', icon: '🔥', slug: 'bbq' },
      { name: 'Baking', icon: '👩‍🍳', slug: 'baking' },
      { name: 'Slow Cooker', icon: '🥘', slug: 'slow-cooker' },
      { name: 'Healthy', icon: '🥗', slug: 'healthy' }
    ]
  };

  // Flatten categories for mobile view
  const allCategories = Object.values(categoryGroups).flat();

  // Cleanup function for search
  const cleanupSearch = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
      searchAbortControllerRef.current = null;
    }
  };

  // Enhanced search functionality with proper debouncing and error handling
  useEffect(() => {
    // Clear any existing timeout
    cleanupSearch();
    
    const query = searchQuery.trim();
    
    // Reset states for empty queries
    if (query.length === 0) {
      setSearchResults([]);
      setIsSearchOpen(false);
      setSearchError('');
      setLastSearchQuery('');
      return;
    }
    
    // Don't search for queries less than 2 characters
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearchOpen(false);
      setSearchError('');
      return;
    }
    
    // Don't search if query hasn't changed
    if (query === lastSearchQuery && !searchError) {
      setIsSearchOpen(searchResults.length > 0);
      return;
    }
    
    // Set up debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
    
    return cleanupSearch;
  }, [searchQuery]);

  // Close dropdowns when clicking outside with proper event handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      try {
        if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
          setIsSearchOpen(false);
          setSearchError('');
        }
        if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target)) {
          setIsCategoriesOpen(false);
        }
      } catch (error) {
        console.warn('Error in click outside handler:', error);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsCategoriesOpen(false);
        setSearchError('');
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupSearch();
    };
  }, []);

  // Enhanced search function with comprehensive validation and rate limiting
  const handleSearch = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setIsSearchOpen(false);
      setSearchError('');
      return;
    }
    
    // Validate and sanitize input
    const validation = validateSearchQuery(query);
    if (!validation.isValid) {
      setSearchError(validation.errors[0]);
      setSearchResults([]);
      setIsSearchOpen(true);
      return;
    }
    
    const sanitizedQuery = validation.sanitized;
    
    // Check rate limiting
    const rateLimitCheck = searchRateLimiter.canMakeRequest();
    if (!rateLimitCheck.allowed) {
      const remainingTime = Math.ceil(searchRateLimiter.getRemainingTime() / 1000);
      setSearchError(`Too many searches. Please wait ${remainingTime} seconds.`);
      setSearchResults([]);
      setIsSearchOpen(true);
      return;
    }
    
    // Abort any ongoing search
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }
    
    // Create new abort controller for this search
    searchAbortControllerRef.current = new AbortController();
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      const results = await simpleSearchRecipes(
        sanitizedQuery, 
        1, 
        6,
        { signal: searchAbortControllerRef.current.signal }
      );
      
      // Check if search was aborted
      if (searchAbortControllerRef.current?.signal.aborted) {
        return;
      }
      
      // Validate response structure
      if (!results || typeof results !== 'object') {
        throw new Error('Invalid search response');
      }
      
      const recipes = Array.isArray(results.results) ? results.results : [];
      
      // Validate each recipe object
      const validatedRecipes = recipes.filter(recipe => 
        recipe && 
        typeof recipe === 'object' && 
        recipe.id && 
        recipe.title && 
        typeof recipe.title === 'string'
      );
      
      setSearchResults(validatedRecipes);
      setLastSearchQuery(sanitizedQuery);
      setIsSearchOpen(true);
      
      // Add to search history if results found
      if (validatedRecipes.length > 0) {
        searchHistory.addSearch(sanitizedQuery);
      }
      
    } catch (error) {
      // Don't show error for aborted requests
      if (error.name === 'AbortError' || searchAbortControllerRef.current?.signal.aborted) {
        return;
      }
      
      console.error('Search failed:', error);
      
      // Set user-friendly error messages based on error type
      if (error.message.includes('Network Error') || error.code === 'NETWORK_ERROR') {
        setSearchError('Network connection issue. Please check your internet.');
      } else if (error.message.includes('timeout') || error.code === 'TIMEOUT') {
        setSearchError('Search timed out. Please try again.');
      } else if (error.status === 429 || error.code === 'RATE_LIMITED') {
        setSearchError('Too many requests. Please wait a moment.');
      } else if (error.status >= 500 || error.code === 'SERVER_ERROR') {
        setSearchError('Server error. Please try again later.');
      } else if (error.status === 401 || error.code === 'UNAUTHORIZED') {
        setSearchError('Authentication required. Please sign in.');
      } else {
        setSearchError('Search failed. Please try again.');
      }
      
      setSearchResults([]);
      setIsSearchOpen(true); // Keep open to show error
      
    } finally {
      setIsSearching(false);
      searchAbortControllerRef.current = null;
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Validate and sanitize the search query before submission
      const validation = validateSearchQuery(searchQuery.trim());
      const sanitizedQuery = validation.sanitized || searchQuery.trim();
      
      setIsSearchOpen(false);
      setSearchQuery('');
      
      // Add to search history
      searchHistory.addSearch(sanitizedQuery);
      
      navigate(`/recipes?search=${encodeURIComponent(sanitizedQuery)}`);
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Enhanced input change handler with real-time sanitization
  const handleSearchInputChange = (e) => {
    const rawValue = e.target.value;
    
    // Apply basic sanitization while preserving user experience
    const sanitized = sanitizeSearchInput(rawValue);
    
    setSearchQuery(sanitized);
  };

  const handleSearchResultClick = (recipeId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/recipes/${recipeId}`);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categorySlug) => {
    setIsCategoriesOpen(false);
    setIsMenuOpen(false);
    navigate(`/recipes?category=${categorySlug}`);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-violet-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeAllMenus}>
                <span className="text-2xl font-bold gradient-text hover:from-brand-700 hover:to-primary-700 transition-all duration-300">
                  🍴 TasteStack
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Navigation Links */}
              <Link 
                to="/" 
                className="nav-link px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesDropdownRef}>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="text-gray-600 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center"
                >
                  Categories
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Categories Dropdown Menu */}
                {isCategoriesOpen && (
                  <div className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
                      {Object.entries(categoryGroups).map(([groupName, categories]) => (
                        <div key={groupName} className="mb-4 last:mb-0">
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                            {groupName}
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {categories.map((category) => (
                              <button
                                key={category.slug}
                                onClick={() => handleCategoryClick(category.slug)}
                                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                              >
                                <span className="text-lg mr-2">{category.icon}</span>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-violet-600">
                                  {category.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link 
                to="/about" 
                className="text-gray-600 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>

              {/* Enhanced Modern Search Bar */}
              <div className="relative min-w-0 flex-1 max-w-md" ref={searchDropdownRef}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative group">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="✨ Search recipes, ingredients, chefs..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="block w-full pl-12 pr-12 py-3 text-sm bg-gradient-to-r from-gray-50/90 to-gray-50/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm transition-all duration-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-300 focus:bg-white focus:shadow-xl hover:bg-white hover:shadow-lg hover:border-gray-300 hover:from-white hover:to-white"
                      maxLength={100}
                      autoComplete="off"
                    />
                    {/* Enhanced Search Icon */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {isSearching ? (
                        <div className="relative">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-400 border-t-transparent"></div>
                          <div className="absolute inset-0 rounded-full bg-violet-400/20 animate-ping"></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <svg className="h-4 w-4 text-gray-400 group-focus-within:text-violet-500 group-hover:text-gray-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <div className="absolute inset-0 bg-violet-500/10 rounded-full scale-0 group-focus-within:scale-110 transition-transform duration-300"></div>
                        </div>
                      )}
                    </div>
                    {/* Clear Button */}
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setIsSearchOpen(false);
                          setSearchResults([]);
                        }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {/* Enhanced gradient border effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm animate-pulse"></div>
                    {/* Subtle inner glow */}
                    <div className="absolute inset-1 rounded-2xl bg-gradient-to-r from-white to-gray-50/50 opacity-0 group-focus-within:opacity-60 transition-opacity duration-300 -z-10"></div>
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {isSearchOpen && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                    {searchError ? (
                      <div className="p-4">
                        <div className="flex items-center space-x-2 text-red-600 mb-3">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Search Error</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{searchError}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSearchError('');
                              handleSearch(searchQuery.trim());
                            }}
                            className="flex-1 text-center text-violet-600 hover:text-violet-700 text-sm font-medium py-2 px-3 border border-violet-200 rounded-md hover:bg-violet-50 transition-colors"
                          >
                            Try Again
                          </button>
                          <button
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchError('');
                              navigate('/recipes');
                            }}
                            className="flex-1 text-center text-gray-600 hover:text-gray-700 text-sm font-medium py-2 px-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Browse All
                          </button>
                        </div>
                      </div>
                    ) : isSearching ? (
                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600"></div>
                          <span className="text-sm text-gray-600">Searching recipes...</span>
                        </div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Search Results
                          </div>
                          <div className="text-xs text-gray-400">
                            {searchResults.length} found
                          </div>
                        </div>
                        {searchResults.map((recipe) => (
                          <button
                            key={recipe.id}
                            onClick={() => handleSearchResultClick(recipe.id)}
                            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group border-b border-gray-50 last:border-b-0"
                          >
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                              {recipe.image ? (
                                <img 
                                  src={recipe.image} 
                                  alt={recipe.title} 
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`${recipe.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                                <span className="text-lg">🍽️</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 group-hover:text-violet-600 truncate">
                                {recipe.title}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <span className="mr-3 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  {((recipe.prep_time || 0) + (recipe.cook_time || 0)) || 'N/A'} min
                                </span>
                                <span className="flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {recipe.difficulty || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                        <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
                          <button
                            onClick={() => {
                              setIsSearchOpen(false);
                              const currentQuery = searchQuery;
                              setSearchQuery('');
                              navigate(`/recipes?search=${encodeURIComponent(currentQuery)}`);
                            }}
                            className="w-full text-center text-violet-600 hover:text-violet-700 text-sm font-medium py-2 rounded-md hover:bg-violet-50 transition-colors"
                          >
                            See all results →
                          </button>
                          <button
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              navigate('/recipes');
                            }}
                            className="w-full text-center text-gray-500 hover:text-gray-700 text-xs font-medium py-1 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            🔍 Advanced Search
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <div className="text-gray-400 mb-2">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">No recipes found for "{searchQuery}"</p>
                        <button
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                            navigate('/recipes');
                          }}
                          className="text-violet-600 hover:text-violet-700 text-sm font-medium py-1 px-3 rounded-md hover:bg-violet-50 transition-colors"
                        >
                          Browse All Recipes
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/create-recipe" 
                    className="btn-primary text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-violet-200 to-purple-200 flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-0.5">
                      {user?.profile_picture ? (
                        <img
                          src={user.profile_picture.startsWith('/') 
                            ? `http://localhost:8000${user.profile_picture}` 
                            : user.profile_picture}
                          alt={user.username}
                          className="w-full h-full object-contain rounded-full bg-white"
                        />
                      ) : (
                        <span className="text-violet-600 font-semibold text-sm">
                          {(user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U').toUpperCase()}
                        </span>
                      )}
                    </div>

                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-secondary text-sm"
                  >
                    Join Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500 transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-gray-200">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    maxLength={100}
                    autoComplete="off"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                onClick={closeAllMenus}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                🏠 Home
              </Link>
              
              {/* Mobile Categories */}
              <div className="px-3 py-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Popular Categories
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {allCategories.slice(0, 8).map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-lg mr-2">{category.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </button>
                  ))}
                </div>
                <Link 
                  to="/recipes" 
                  onClick={closeAllMenus}
                  className="block mt-3 text-center text-violet-600 text-sm font-medium"
                >
                  View All Categories →
                </Link>
              </div>

              <Link 
                to="/about" 
                onClick={closeAllMenus}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                ℹ️ About
              </Link>
            </div>

            {/* Mobile Auth */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="px-2 space-y-1">
                  <Link 
                    to="/create-recipe" 
                    onClick={closeAllMenus}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors"
                  >
                    ➕ Create Recipe
                  </Link>
                  <Link 
                    to="/dashboard" 
                    onClick={closeAllMenus}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    👤 Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                  <Link 
                    to="/login" 
                    onClick={closeAllMenus}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    🔑 Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={closeAllMenus}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors mx-1"
                  >
                    🚀 Join Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop for dropdowns */}
      {(isCategoriesOpen || isSearchOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={closeAllMenus}
        />
      )}
    </>
  );
};

export default Navbar;