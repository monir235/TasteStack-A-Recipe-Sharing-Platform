import React, { useState, useEffect } from 'react';
import { getRecipes } from '../services/recipeService';
import { Link } from 'react-router-dom';

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipeData = await getRecipes(1, 100); // Get first 100 recipes
        setRecipes(recipeData.results || []);
      } catch (err) {
        setError('Failed to fetch recipes');
        console.error('Failed to fetch recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">All Recipes</h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Discover delicious recipes from our community
        </p>
      </div>
      
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
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
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
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
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  );
};

export default RecipeListPage;
