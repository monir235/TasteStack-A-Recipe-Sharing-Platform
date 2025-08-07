import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipe, rateRecipe, likeRecipe, unlikeRecipe, addComment, getComments, deleteComment } from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
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
  }, [id]);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    // You can call likeRecipe or unlikeRecipe here to interact with the backend
    if (!isLiked) {
      likeRecipe(id);  // Call like API
    } else {
      unlikeRecipe(id); // Call unlike API
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
              <h3 className="text-sm font-medium text-red-800">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}
      
      {recipe && !loading && !error && (
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">{recipe.title}</h1>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-medium">
                    {recipe.author?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">By {recipe.author?.name || 'Unknown'}</p>
                <a href={`/profile/${recipe.author?.id}`} className="text-sm text-indigo-600 hover:text-indigo-500">
                  View Profile
                </a>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
              <div className="flex items-center">
                <span className="text-yellow-400">
                  {'★'.repeat(Math.floor(recipe.average_rating))}
                  {'☆'.repeat(5 - Math.floor(recipe.average_rating))}
                </span>
                <span className="ml-1 text-sm text-gray-500">({recipe.average_rating})</span>
              </div>
              <button
                onClick={handleLike}
                className={`ml-4 flex items-center text-sm font-medium ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="ml-1">Like</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Image */}
      <div className="mb-8">
        <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          {recipe && recipe.image ? (
            <img src={recipe.image} alt={recipe.title || 'Recipe image'} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-gray-500">No image available</span>
          )}
        </div>
      </div>

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
                        <h4 className="text-sm font-medium text-gray-900">
                          {comment.author && typeof comment.author === 'string' ? comment.author : 'Unknown User'}
                        </h4>
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
  );
};

export default RecipeDetailPage;
