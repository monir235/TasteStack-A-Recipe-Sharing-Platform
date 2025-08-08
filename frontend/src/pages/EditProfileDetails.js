import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const EditProfileDetails = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editedUser, setEditedUser] = useState({
    ...user,
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const updatedUser = await updateProfile(editedUser);
      // If updateProfile returns a valid user, update and redirect
      if (updatedUser && updatedUser.id) {
        updateUser(updatedUser);
        navigate('/profile');
      } else {
        setError('Profile update failed. Please check your data and try again.');
      }
    } catch (err) {
      // Only log out if error message is 'Unauthorized'
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    navigate('/profile');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-8 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-xl p-10 flex flex-col items-center border border-gray-100">
        <div className="h-36 w-36 rounded-full bg-gradient-to-tr from-indigo-200 via-purple-200 to-indigo-100 flex items-center justify-center relative mb-8 shadow-lg">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {editedUser.profile_picture ? (
              <img
                src={editedUser.profile_picture
                  ? (typeof editedUser.profile_picture === 'string'
                      ? (editedUser.profile_picture.startsWith('/')
                          ? `http://localhost:8000${editedUser.profile_picture}`
                          : editedUser.profile_picture)
                      : URL.createObjectURL(editedUser.profile_picture))
                  : ''}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-lg">Avatar</span>
            )}
          </div>
          <label className="absolute inset-0 rounded-full cursor-pointer bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEditedUser(prev => ({
                    ...prev,
                    profile_picture: e.target.files[0]
                  }));
                }
              }}
            />
          </label>
        </div>
        <form className="w-full space-y-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div>
                <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={editedUser.first_name || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={editedUser.last_name || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={editedUser.email || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              id="bio"
              rows={3}
              value={editedUser.bio || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                id="location"
                value={editedUser.location || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                id="website"
                value={editedUser.website || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={loading}
              className="inline-flex items-center px-7 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center px-7 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4 mt-4">
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
        </form>
      </div>
    </div>
  );
};

export default EditProfileDetails;
