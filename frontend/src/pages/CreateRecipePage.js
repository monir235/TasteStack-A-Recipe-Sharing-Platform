import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRecipe, updateRecipe, getRecipe } from '../services/recipeService';


const CATEGORY_SECTIONS = {
  'Meal Types': [
    { id: 'breakfast', name: 'Breakfast', icon: '🥞' },
    { id: 'lunch', name: 'Lunch', icon: '🥗' },
    { id: 'dinner', name: 'Dinner', icon: '🍖' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
    { id: 'appetizer', name: 'Appetizers', icon: '🥨' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' }
  ],
  'Dish Types': [
    { id: 'soup', name: 'Soups', icon: '🍲' },
    { id: 'salad', name: 'Salads', icon: '🥙' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'seafood', name: 'Seafood', icon: '🦐' },
    { id: 'bbq', name: 'BBQ & Grilled', icon: '🔥' }
  ],
  'Cuisines': [
    { id: 'asian', name: 'Asian', icon: '🥢' },
    { id: 'italian', name: 'Italian', icon: '🇮🇹' },
    { id: 'mexican', name: 'Mexican', icon: '🌮' },
    { id: 'indian', name: 'Indian', icon: '🍛' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '🫒' },
    { id: 'american', name: 'American', icon: '🍔' },
    { id: 'french', name: 'French', icon: '🇫🇷' },
    { id: 'middle-eastern', name: 'Middle Eastern', icon: '🧆' }
  ],
  'Dietary': [
    { id: 'vegetarian', name: 'Vegetarian', icon: '🥬' },
    { id: 'vegan', name: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', name: 'Gluten Free', icon: '🌾' },
    { id: 'keto', name: 'Keto', icon: '🥑' },
    { id: 'healthy', name: 'Healthy', icon: '💚' },
    { id: 'quick', name: 'Quick & Easy', icon: '⚡' }
  ]
};

const CATEGORIES = Object.values(CATEGORY_SECTIONS).flat();

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy',
    ingredients: [''],
    instructions: [''],
    categories: [],
    image: null
  });

  // Load existing recipe data when editing
  useEffect(() => {
    console.log('Token in localStorage:', localStorage.getItem('token')); // Debugging
    
    if (id) {
      const fetchRecipe = async () => {
        try {
          const recipeData = await getRecipe(id);
          setRecipe({
            title: recipeData.title,
            description: recipeData.description,
            prepTime: recipeData.prep_time,
            cookTime: recipeData.cook_time,
            servings: recipeData.servings,
            difficulty: recipeData.difficulty,
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
            categories: Array.isArray(recipeData.categories) ? recipeData.categories : (recipeData.category ? [recipeData.category] : []),
            image: null
          });
        } catch (err) {
          console.error('Failed to fetch recipe:', err);
          if (err.status === 401) {
            alert('Your session has expired. Please log in again.');
            navigate('/login');
          } else {
            alert('Failed to load recipe. Please try again.');
          }
        }
      };
      
      fetchRecipe();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange called with:', name, value); // Debugging
    setRecipe(prev => {
      const newState = {
        ...prev,
        [name]: value
      };
      console.log('New state:', newState); // Debugging
      return newState;
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setRecipe(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleIngredientChange = (index, value) => {
    console.log('handleIngredientChange called with:', index, value); // Debugging
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => {
      const newState = {
        ...prev,
        ingredients: newIngredients
      };
      console.log('New state:', newState); // Debugging
      return newState;
    });
  };

  const handleInstructionChange = (index, value) => {
    console.log('handleInstructionChange called with:', index, value); // Debugging
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => {
      const newState = {
        ...prev,
        instructions: newInstructions
      };
      console.log('New state:', newState); // Debugging
      return newState;
    });
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeIngredient = (index) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients.splice(index, 1);
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const removeInstruction = (index) => {
    const newInstructions = [...recipe.instructions];
    newInstructions.splice(index, 1);
    setRecipe(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setRecipe(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };
  
  // Function to get file name from path
  const getFileName = (path) => {
    if (!path) return '';
    return path.split('\\').pop().split('/').pop();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Token in localStorage on submit:', localStorage.getItem('token')); // Debugging
    console.log('Recipe data on submit:', recipe); // Debugging
    
    try {
      const recipeData = {
        ...recipe,
        category: recipe.categories.join(', ')
      };
      
      if (id) {
        await updateRecipe(id, recipeData);
        alert('Recipe updated successfully!');
      } else {
        await createRecipe(recipeData);
        alert('Recipe created successfully!');
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save recipe:', err);
      
      if (err.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else if (err.status === 403) {
        alert('You do not have permission to perform this action.');
      } else if (err.message) {
        alert(`Failed to save recipe: ${err.message}`);
      } else {
        alert('Failed to save recipe. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{id ? 'Edit Recipe' : 'Create New Recipe'}</h1>
        <p className="mt-2 text-gray-600">{id ? 'Update your recipe details' : 'Share your culinary creation with the world'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recipe Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic details about your recipe</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Recipe Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={recipe.title}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={recipe.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Briefly describe your recipe and what makes it special.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">
                  Prep Time (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="prepTime"
                    id="prepTime"
                    value={recipe.prepTime}
                    onChange={handleChange}
                    required
                    min="0"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">
                  Cook Time (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="cookTime"
                    id="cookTime"
                    value={recipe.cookTime}
                    onChange={handleChange}
                    required
                    min="0"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
                  Servings
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="servings"
                    id="servings"
                    value={recipe.servings}
                    onChange={handleChange}
                    required
                    min="1"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                  Difficulty Level
                </label>
                <div className="mt-1">
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={recipe.difficulty}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              {/* Categories Section */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">Categories</label>
                <div className="space-y-6">
                  {Object.entries(CATEGORY_SECTIONS).map(([sectionName, categories]) => (
                    <div key={sectionName}>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{sectionName}</h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategoryToggle(category.id)}
                            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                              recipe.categories.includes(category.id)
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                            }`}
                          >
                            <span className="mr-2 text-base">{category.icon}</span>
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {recipe.categories.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-3">{recipe.categories.length} categories selected</p>
                      <div className="flex flex-wrap gap-2">
                        {recipe.categories.map(categoryId => {
                          const category = CATEGORIES.find(c => c.id === categoryId);
                          return category ? (
                            <span
                              key={categoryId}
                              className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                            >
                              <span className="mr-1">{category.icon}</span>
                              {category.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Ingredients</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">List all ingredients needed for your recipe</p>
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Ingredient
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder={`Ingredient ${index + 1}`}
                    />
                  </div>
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Instructions</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Step-by-step instructions for preparing your recipe</p>
              </div>
              <button
                type="button"
                onClick={addInstruction}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Step
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <textarea
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      required
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder={`Step ${index + 1} instructions`}
                    />
                  </div>
                  {recipe.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recipe Image</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Upload a photo of your finished recipe</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {recipe.image ? (
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <img
                      src={URL.createObjectURL(recipe.image)}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {getFileName(recipe.image.name)}
                  </div>
                  <div className="mt-2">
                    <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Change image</span>
                      <input id="image" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id="image" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {id ? 'Update Recipe' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;