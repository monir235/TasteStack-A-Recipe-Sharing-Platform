import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRecipe, rateRecipe, likeRecipe, unlikeRecipe, addComment, getComments, deleteComment, editComment, hideComment } from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // User interaction state
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const recipeData = await getRecipe(id);
        setRecipe(recipeData);
        
        // Set user's like and rating state from recipe data
        if (user && recipeData) {
          setIsLiked(recipeData.is_liked || false);
          setUserRating(recipeData.user_rating || 0);
        }
        
        // Try to fetch comments, but handle authentication errors
        try {
          const commentsData = await getComments(id);
          // Check if commentsData is an array before setting it
          if (Array.isArray(commentsData)) {
            setComments(commentsData);
          } else {
            // If it's not an array, it might be an error response
            setComments([]);
          }
        } catch (commentsErr) {
          // If fetching comments fails, set an empty array
          console.error('Failed to fetch comments:', commentsErr);
          setComments([]);
        }
      } catch (err) {
        setError('Failed to fetch recipe data');
        console.error('Failed to fetch recipe data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipeData();
  }, [id, user]);

  // Edit a comment
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  // Save edited comment
  const handleSaveComment = async (commentId) => {
    try {
      await editComment(id, commentId, editingCommentContent);
      // Update the comment in the state
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, content: editingCommentContent }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (err) {
      console.error('Failed to edit comment:', err);
      alert('Failed to edit comment. Please try again.');
    }
  };

  // Cancel editing a comment
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // Hide a comment
  const handleHideComment = async (commentId) => {
    if (window.confirm('Are you sure you want to hide this comment?')) {
      try {
        await hideComment(id, commentId);
        // Update the comment in the state to mark it as hidden
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? { ...comment, hidden: true }
              : comment
          )
        );
      } catch (err) {
        console.error('Failed to hide comment:', err);
        alert('Failed to hide comment. Please try again.');
      }
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(id, commentId);
        // Remove the deleted comment from the state
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      } catch (err) {
        console.error('Failed to delete comment:', err);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      
      if (newIsLiked) {
        await likeRecipe(id);
        // Update likes count locally
        setRecipe(prev => prev ? { ...prev, likes_count: (prev.likes_count || 0) + 1 } : prev);
      } else {
        await unlikeRecipe(id);
        // Update likes count locally
        setRecipe(prev => prev ? { ...prev, likes_count: Math.max((prev.likes_count || 0) - 1, 0) } : prev);
      }
    } catch (error) {
      // Revert the like state if the API call failed
      setIsLiked(isLiked);
      console.error('Failed to update like status:', error);
      alert('Failed to update like status. Please try again.');
    }
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    // In a real app, you would submit the rating to the backend
    rateRecipe(id, rating); // Submit rating to backend
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Submit comment to backend
    addComment(id, newComment);
    setComments([...comments, { author: 'User', content: newComment, rating: userRating, timestamp: new Date() }]); // Update UI with new comment
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-red-900">{error}</h3>
            </div>
          </div>
        )}
      
        {recipe && !loading && !error && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {recipe.author?.name?.charAt(0) || recipe.author?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-4">
                    {recipe.author ? (
                      <Link to={`/profile/${recipe.author.id}`} className="text-lg font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                        {recipe.author.name || recipe.author.username}
                      </Link>
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">Unknown Chef</p>
                    )}
                    <p className="text-sm text-gray-600">Recipe Creator</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:ml-8">
                {user && recipe.author && user.id === recipe.author.id && (
                  <button
                    onClick={() => navigate(`/recipes/${id}/edit`)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-violet-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Recipe
                  </button>
                )}
                
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center px-6 py-3 font-semibold rounded-2xl transition-all transform hover:scale-105 shadow-lg ${
                    isLiked 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  <svg className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {isLiked ? 'Liked' : 'Like'} ({recipe.likes_count || 0})
                </button>
                
                <div className="flex items-center px-6 py-3 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                  <span className="text-yellow-500 text-xl">
                    {'★'.repeat(Math.floor(recipe.average_rating || 0))}
                    {'☆'.repeat(5 - Math.floor(recipe.average_rating || 0))}
                  </span>
                  <span className="ml-2 font-semibold text-gray-700">({recipe.average_rating || 0})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {recipe && (
          <div className="mb-8">
            <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl overflow-hidden shadow-2xl">
              {recipe.image ? (
                <img src={recipe.image} alt={recipe.title || 'Recipe image'} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-violet-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xl font-semibold text-violet-400">No image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Recipe Info */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Prep Time</p>
          <p className="text-lg font-semibold">{recipe?.prep_time || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Cook Time</p>
          <p className="text-lg font-semibold">{recipe?.cook_time || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Servings</p>
          <p className="text-lg font-semibold">{recipe?.servings || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Difficulty</p>
          <p className="text-lg font-semibold">{recipe?.difficulty || 'N/A'}</p>
        </div>
      </div>

      {/* Recipe Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-600">{recipe?.description || 'No description available'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-indigo-600">•</span>
                    <span className="ml-2 text-gray-700">{ingredient}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No ingredients listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe && Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                recipe.instructions.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                      {index + 1}
                    </span>
                    <span className="ml-4 text-gray-700">{step}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No instructions provided</li>
              )}
            </ol>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate this Recipe</h2>
        <div className="flex items-center">
          <span className="text-gray-700 mr-4">Your Rating:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className={`text-2xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
        
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-800 font-medium">U</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id || comment.timestamp || Math.random()} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-medium">
                    {comment.author && typeof comment.author === 'string' ? comment.author.charAt(0) : 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                {editingCommentId === comment.id ? (
                  <div className="mb-2">
                    <textarea
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleSaveComment(comment.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {comment.user && comment.user.id ? (
                          <Link 
                            to={`/profile/${comment.user.id}`} 
                            className="text-sm font-medium text-violet-600 hover:text-violet-700"
                          >
                            {comment.user.username || comment.user.first_name || 'Unknown User'}
                          </Link>
                        ) : (
                          <h4 className="text-sm font-medium text-gray-900">
                            {comment.author && typeof comment.author === 'string' ? comment.author : 'Unknown User'}
                          </h4>
                        )}
                        <span className="ml-2 text-sm text-gray-500">
                          {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {comment.id && user && comment.user && user.id === comment.user.id && (
                          <>
                            <button
                              onClick={() => handleEditComment(comment.id, comment.content)}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {comment.id && user && recipe && recipe.author && user.id === recipe.author.id && user.id !== comment.user.id && (
                          <button
                            onClick={() => handleHideComment(comment.id)}
                            className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                          >
                            Hide
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center">
                      <span className="text-yellow-400">
                        {comment.rating ? '★'.repeat(Math.min(5, Math.floor(comment.rating))) : ''}
                        {comment.rating ? '☆'.repeat(Math.max(0, 5 - Math.floor(comment.rating))) : 'No rating'}
                      </span>
                    </div>
                    {comment.hidden ? (
                      <p className="mt-1 text-gray-500 italic">This comment has been hidden by the recipe owner.</p>
                    ) : (
                      <p className="mt-1 text-gray-700">{comment.content || 'No comment content'}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
