import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getStatistics } from '../services/statisticsService';

const CTAButtons = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {isAuthenticated ? (
        <>
          <Link
            to="/create-recipe"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Share Your Recipe
            <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-violet-600 bg-white rounded-2xl shadow-lg border-2 border-violet-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-violet-300 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-300"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            My Dashboard
            <div className="absolute inset-0 rounded-2xl bg-violet-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Create an Account
            <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/recipes"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-violet-600 bg-white rounded-2xl shadow-lg border-2 border-violet-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-violet-300 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-300"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Browse Recipes
            <div className="absolute inset-0 rounded-2xl bg-violet-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
        </>
      )}
    </div>
  );
};

const AboutPage = () => {
  const [statistics, setStatistics] = useState({
    total_recipes: 0,
    total_users: 0,
    total_ratings: 0,
    unique_countries: 0,
    founded_year: new Date().getFullYear(),
    platform_rating: 5.0,
    happy_chefs: 0,
    recipes_shared: 0
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const statsData = await getStatistics();
        setStatistics(statsData);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };
    
    fetchStatistics();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-32 right-10 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 mb-8">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Made with ❤️ for Food Lovers
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">
              About{' '}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TasteStack
              </span>
            </h1>
            
            <p className="mt-6 max-w-3xl mx-auto text-xl sm:text-2xl leading-relaxed text-gray-600 dark:text-gray-300">
              Connecting food lovers through the joy of cooking and sharing recipes.
              <span className="block mt-2 text-lg text-violet-600 dark:text-violet-400 font-semibold">
                Where culinary passion meets community spirit.
              </span>
            </p>
            
            {/* Floating Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20 shadow-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.founded_year}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Founded</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20 shadow-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.total_recipes > 0 ? 
                    (statistics.total_recipes >= 1000 ? 
                      `${Math.floor(statistics.total_recipes / 1000)}K+` : 
                      statistics.total_recipes) : 
                    '0'
                  }
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Recipes</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20 shadow-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.total_users > 0 ? 
                    (statistics.total_users >= 1000 ? 
                      `${Math.floor(statistics.total_users / 1000)}K+` : 
                      statistics.total_users) : 
                    '0'
                  }
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Chefs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-700 dark:to-purple-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-16 sm:px-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-8">
                Our <span className="text-yellow-300 dark:text-yellow-200">Mission</span>
              </h2>
              <p className="text-xl text-violet-100 dark:text-violet-200 leading-relaxed">
                At TasteStack, we believe that food brings people together. Our mission is to create a vibrant community where food enthusiasts can discover, share, and celebrate recipes from around the world. Whether you're a seasoned chef or a kitchen novice, our platform provides a space for everyone to explore culinary creativity and connect with others who share a passion for cooking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            How It <span className="text-violet-600 dark:text-violet-400">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Three simple steps to join our culinary community and start your cooking journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-3">
          <div className="group relative">
            {/* Step Number */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
              1
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-800 dark:to-purple-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">Discover Recipes</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Browse through thousands of recipes shared by our community members. Filter by cuisine, dietary restrictions, or cooking time to find exactly what you're looking for.
              </p>
            </div>
          </div>

          <div className="group relative">
            {/* Step Number */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
              2
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">Share Your Creations</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Contribute to our growing collection by sharing your own recipes. Add photos, detailed instructions, and cooking tips to help others recreate your dishes.
              </p>
            </div>
          </div>

          <div className="group relative">
            {/* Step Number */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
              3
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-800 dark:to-rose-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">Connect & Engage</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Interact with other food lovers through comments, ratings, and likes. Follow your favorite chefs and build your personal collection of recipes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Our <span className="text-violet-600 dark:text-violet-400">Values</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The principles that guide everything we do at TasteStack
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-800 dark:to-purple-800 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Community First</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We prioritize building a supportive and inclusive community where everyone feels welcome to share their culinary passion.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quality Content</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We strive to maintain high-quality content by encouraging detailed recipes, clear instructions, and beautiful food photography.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Accessibility</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We believe great recipes should be accessible to everyone, regardless of their cooking experience or dietary needs.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-800 dark:to-orange-800 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Continuous Learning</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We encourage our community to learn, experiment, and grow their culinary skills through shared knowledge and feedback.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-violet-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Join Our <span className="text-violet-600 dark:text-violet-400">Community</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ready to start your culinary journey with TasteStack? Connect with food lovers from around the world and discover your next favorite recipe.
          </p>
          
          <CTAButtons />
          
          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center space-x-8 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {statistics.platform_rating || '5.0'}
              </div>
              <div className="text-xs text-gray-500">★★★★★</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {statistics.happy_chefs > 0 ? 
                  (statistics.happy_chefs >= 1000 ? 
                    `${Math.floor(statistics.happy_chefs / 1000)}K+` : 
                    statistics.happy_chefs) : 
                  '0'
                }
              </div>
              <div className="text-xs text-gray-500">Happy Chefs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {statistics.recipes_shared > 0 ? 
                  (statistics.recipes_shared >= 1000 ? 
                    `${Math.floor(statistics.recipes_shared / 1000)}K+` : 
                    statistics.recipes_shared) : 
                  '0'
                }
              </div>
              <div className="text-xs text-gray-500">Recipes Shared</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;