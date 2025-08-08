import React, { useState } from 'react';
import { addComment, getComments } from '../services/recipeService';

const CommentDebugger = ({ recipeId = 1 }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    setError('');
    try {
      const newComment = await addComment(recipeId, comment);
      console.log('Comment added successfully:', newComment);
      setComment('');
      // Refresh comments
      await fetchComments();
    } catch (err) {
      setError(err.message);
      console.error('Failed to add comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(recipeId);
      setComments(fetchedComments);
      console.log('Comments fetched:', fetchedComments);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 m-4">
      <h3 className="text-lg font-bold text-yellow-800 mb-4">
        🐛 Comment Debugger (Recipe ID: {recipeId})
      </h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleAddComment} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type a test comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </form>

      <button
        onClick={fetchComments}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Refresh Comments
      </button>

      <div>
        <h4 className="font-semibold mb-2">Comments ({comments.length}):</h4>
        {comments.length === 0 ? (
          <p className="text-gray-600 italic">No comments yet</p>
        ) : (
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm text-gray-600">{c.author}</p>
                    <p className="mt-1">{c.content}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(c.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentDebugger;
