import React, { useState, useEffect } from 'react';
import { getRecipes } from '../services/recipeService';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', name: 'All Recipes', icon: '🍽️' },
  { id: 'breakfast', name: 'Breakfast', icon: '🥞' },
  { id: 'lunch', name: 'Lunch', icon: '🥗' },
  { id: 'dinner', name: 'Dinner', icon: '🍖' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' },
  { id: 'appetizer', name: 'Appetizers', icon: '🥨' },
  { id: 'soup', name: 'Soups', icon: '🍲' },
  { id: 'salad', name: 'Salads', icon: '🥙' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'seafood', name: 'Seafood', icon: '🦐' },
  { id: 'vegetarian', name: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', name: 'Vegan', icon: '🌱' },
  { id: 'gluten-free', name: 'Gluten Free', icon: '🌾' },
  { id: 'healthy', name: 'Healthy', icon: '💚' },
  { id: 'quick', name: 'Quick & Easy', icon: '⚡' }
];

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipeData = await getRecipes(1, 100); // Get first 100 recipes
        const recipeList = recipeData.results || [];
        setRecipes(recipeList);
        setFilteredRecipes(recipeList);
      } catch (err) {
        setError('Failed to fetch recipes');
        console.error('Failed to fetch recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe => 
        recipe.category?.toLowerCase().includes(categoryId) ||
        recipe.title?.toLowerCase().includes(categoryId) ||
        recipe.description?.toLowerCase().includes(categoryId) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(categoryId))
      );
      setFilteredRecipes(filtered);
    }
  };
  
  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Colorful Animated Theme */}
      <div className="relative bg-gradient-to-br from-violet-50 via-white to-purple-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-32 right-10 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              All <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Recipes</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Discover delicious recipes from our amazing community of food lovers
            </p>
          </div>
          
          {/* Category Filter Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`group relative p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/80 hover:bg-white text-gray-700 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-xs font-medium">{category.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            {selectedCategory === 'all' ? 'All Recipes' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            <span className="ml-2 text-lg font-normal text-gray-600">({filteredRecipes.length} recipes)</span>
          </h3>
        </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      )}
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="group block">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100">
                <div className="relative overflow-hidden">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-violet-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-violet-400 font-medium">Recipe Image</span>
                      </div>
                    </div>
                  )}
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
                  <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                  <p className="mt-2 text-gray-600">{recipe.description?.substring(0, 100) || 'No description available'}...</p>
                  <div className="mt-4 flex items-center justify-between">
                    {recipe.author ? (
                      <Link 
                        to={`/profile/${recipe.author.id}`} 
                        className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        By {recipe.author.name || recipe.author.username}
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-500">By Unknown</span>
                    )}
                    <div className="flex items-center">
                      <span className="text-yellow-400">
                        {'★'.repeat(Math.floor(recipe.average_rating))}
                        {'☆'.repeat(5 - Math.floor(recipe.average_rating))}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">({recipe.average_rating})</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                      {recipe.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">{recipe.servings} servings</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && !error && filteredRecipes.length === 0 && recipes.length > 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-600 mb-4">No recipes match the selected category. Try a different category.</p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
          >
            View All Recipes
          </button>
        </div>
      )}
      
      {!loading && !error && recipes.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new recipe.</p>
          <div className="mt-6">
            <a
              href="/create-recipe"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Recipe
            </a>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RecipeListPage;
