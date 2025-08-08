import React, { useState, useEffect } from 'react';
import { getCommentsOnMyRecipes, hideComment, deleteComment } from '../services/dashboardService';

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getCommentsOnMyRecipes();
      setComments(response.comments || []);
    } catch (err) {
      setError('Failed to fetch comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHideComment = async (recipeId, commentId) => {
    if (window.confirm('Are you sure you want to hide this comment?')) {
      try {
        await hideComment(recipeId, commentId);
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, hidden: true }
            : comment
        ));
      } catch (err) {
        console.error('Failed to hide comment:', err);
        alert('Failed to hide comment. Please try again.');
      }
    }
  };

  const handleDeleteComment = async (recipeId, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      try {
        await deleteComment(recipeId, commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) {
        console.error('Failed to delete comment:', err);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Comments on Your Recipes ({comments.length})
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage comments left by other users on your recipes
        </p>
      </div>

      {comments.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>No comments on your recipes yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <div key={comment.id} className={`p-6 ${comment.hidden ? 'bg-gray-50 opacity-75' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <img
                      src={comment.user.profile_picture || 'https://via.placeholder.com/32x32/e5e7eb/6b7280?text=U'}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {comment.user.name || comment.user.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        on{' '}
                        <span className="font-medium text-indigo-600">
                          {comment.recipe.title}
                        </span>
                      </p>
                    </div>
                    {comment.hidden && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Hidden
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()} at{' '}
                    {new Date(comment.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <div className="ml-4 flex space-x-2">
                  {!comment.hidden ? (
                    <button
                      onClick={() => handleHideComment(comment.recipe.id, comment.id)}
                      className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                      title="Hide comment"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m3.88 3.88L18 18M9.878 9.878l-3-3m5.24 5.24L12 12m3.88 3.88l3-3" />
                      </svg>
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Hidden</span>
                  )}
                  
                  <button
                    onClick={() => handleDeleteComment(comment.recipe.id, comment.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                    title="Delete comment permanently"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentManagement;
