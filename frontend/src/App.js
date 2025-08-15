import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EditProfileDetails from './pages/EditProfileDetails';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import RecipeListPage from './pages/RecipeListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

import PublicProfilePage from './pages/PublicProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import AboutPage from './pages/AboutPage';
import RecipeSearchPage from './pages/RecipeSearchPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <ThemeProvider>
        <AuthProvider>
        <ScrollToTop />
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipeSearchPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:userId/:token" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

            <Route path="/profile/:userId" element={<PublicProfilePage />} />
            <Route path="/create-recipe" element={<ProtectedRoute><CreateRecipePage /></ProtectedRoute>} />
            <Route path="/edit-recipe/:id" element={<ProtectedRoute><CreateRecipePage /></ProtectedRoute>} />
            <Route path="/recipes/:id/edit" element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfileDetails /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;