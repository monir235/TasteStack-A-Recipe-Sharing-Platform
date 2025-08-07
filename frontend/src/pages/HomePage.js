import React, { useState, useEffect } from 'react';
import { getRecipes } from '../services/recipeService';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const recipeData = await getRecipes(1, 3); // Get first 3 recipes
        setFeaturedRecipes(recipeData.results || []);
      } catch (err) {
        setError('Failed to fetch featured recipes');
        console.error('Failed to fetch featured recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedRecipes();
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to TasteStack
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
          Discover, share, and enjoy delicious recipes from food enthusiasts around the world.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="rounded-md shadow">
            <a
              href="/recipes"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Browse Recipes
            </a>
          </div>
          <div className="ml-3 rounded-md shadow">
            <a
              href="/register"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Featured Recipes</h2>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                    <p className="mt-2 text-gray-600">{recipe.description?.substring(0, 100) || 'No description available'}...</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {recipe.author?.name || 'Unknown'}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">
                          {'★'.repeat(Math.floor(recipe.average_rating))}
                          {'☆'.repeat(5 - Math.floor(recipe.average_rating))}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">({recipe.average_rating})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;