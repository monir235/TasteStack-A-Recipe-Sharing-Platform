import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EditProfileDetails from './pages/EditProfileDetails';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import RecipeListPage from './pages/RecipeListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import AboutPage from './pages/AboutPage';
import RecipeSearchPage from './pages/RecipeSearchPage';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <AuthProvider>
        <ScrollToTop />
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipeSearchPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<PublicProfilePage />} />
            <Route path="/create-recipe" element={<CreateRecipePage />} />
            <Route path="/edit-recipe/:id" element={<CreateRecipePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/edit-profile" element={<EditProfileDetails />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;