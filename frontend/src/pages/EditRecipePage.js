import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, updateRecipe } from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

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

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prep_time: '',
    cook_time: '',
    servings: '',
    difficulty: 'Easy',
    categories: [],
    image: null
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipe(id);
        
        // Check if user owns this recipe
        if (!user || !recipeData.author || user.id !== recipeData.author.id) {
          setError('You are not authorized to edit this recipe');
          return;
        }
        
        setRecipe(recipeData);
        setFormData({
          title: recipeData.title || '',
          description: recipeData.description || '',
          ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : [''],
          instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : [''],
          prep_time: recipeData.prep_time || '',
          cook_time: recipeData.cook_time || '',
          servings: recipeData.servings || '',
          difficulty: recipeData.difficulty || 'Easy',
          categories: Array.isArray(recipeData.category) ? recipeData.category : (recipeData.category ? [recipeData.category] : []),
          image: null
        });
      } catch (err) {
        setError('Failed to load recipe');
        console.error('Failed to load recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        ingredients: formData.ingredients.filter(item => item.trim()),
        instructions: formData.instructions.filter(item => item.trim()),
        category: formData.categories.join(', ') // Convert array to string for backend compatibility
      };

      await updateRecipe(id, updateData);
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError('Failed to update recipe');
      console.error('Failed to update recipe:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold text-red-900 mb-2">{error}</h3>
            <button
              onClick={() => navigate('/recipes')}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
            >
              Back to Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Recipe</h1>
            <p className="text-gray-600">Update your recipe details</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">Categories</label>
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
                              formData.categories.includes(category.id)
                                ? 'bg-violet-600 text-white shadow-sm'
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
                  {formData.categories.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-3">{formData.categories.length} categories selected</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.categories.map(categoryId => {
                          const category = CATEGORIES.find(c => c.id === categoryId);
                          return category ? (
                            <span
                              key={categoryId}
                              className="inline-flex items-center px-2 py-1 bg-violet-100 text-violet-800 text-xs font-medium rounded-full"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time</label>
                <input
                  type="text"
                  name="prep_time"
                  value={formData.prep_time}
                  onChange={handleInputChange}
                  placeholder="e.g., 15 mins"
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time</label>
                <input
                  type="text"
                  name="cook_time"
                  value={formData.cook_time}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 mins"
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'ingredients')}
                    placeholder="Enter ingredient"
                    className="flex-1 px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'ingredients')}
                      className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('ingredients')}
                className="text-violet-600 hover:text-violet-700 text-sm font-medium"
              >
                + Add Ingredient
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={instruction}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'instructions')}
                    placeholder={`Step ${index + 1}`}
                    rows="2"
                    className="flex-1 px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'instructions')}
                      className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('instructions')}
                className="text-violet-600 hover:text-violet-700 text-sm font-medium"
              >
                + Add Step
              </button>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white py-3 px-6 rounded-2xl font-semibold hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 transition-all transform hover:scale-105"
              >
                {saving ? 'Updating...' : 'Update Recipe'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/recipes/${id}`)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecipePage;