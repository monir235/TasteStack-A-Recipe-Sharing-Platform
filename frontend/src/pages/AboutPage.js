import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          About TasteStack
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
          Connecting food lovers through the joy of cooking and sharing recipes
        </p>
      </div>

      <div className="mt-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-2xl leading-6 font-medium text-gray-900">Our Mission</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-lg text-gray-700">
              At TasteStack, we believe that food brings people together. Our mission is to create a vibrant community where food enthusiasts can discover, share, and celebrate recipes from around the world. Whether you're a seasoned chef or a kitchen novice, our platform provides a space for everyone to explore culinary creativity and connect with others who share a passion for cooking.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-2xl leading-6 font-medium text-gray-900">How It Works</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Discover Recipes</h3>
                <p className="mt-2 text-gray-600">
                  Browse through thousands of recipes shared by our community members. Filter by cuisine, dietary restrictions, or cooking time to find exactly what you're looking for.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Share Your Creations</h3>
                <p className="mt-2 text-gray-600">
                  Contribute to our growing collection by sharing your own recipes. Add photos, detailed instructions, and cooking tips to help others recreate your dishes.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Connect & Engage</h3>
                <p className="mt-2 text-gray-600">
                  Interact with other food lovers through comments, ratings, and likes. Follow your favorite chefs and build your personal collection of recipes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-2xl leading-6 font-medium text-gray-900">Our Values</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Community First</h3>
                <p className="mt-2 text-gray-600">
                  We prioritize building a supportive and inclusive community where everyone feels welcome to share their culinary passion.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Quality Content</h3>
                <p className="mt-2 text-gray-600">
                  We strive to maintain high-quality content by encouraging detailed recipes, clear instructions, and beautiful food photography.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Accessibility</h3>
                <p className="mt-2 text-gray-600">
                  We believe great recipes should be accessible to everyone, regardless of their cooking experience or dietary needs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Continuous Learning</h3>
                <p className="mt-2 text-gray-600">
                  We encourage our community to learn, experiment, and grow their culinary skills through shared knowledge and feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Join Our Community</h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Ready to start your culinary journey with TasteStack?
        </p>
        <div className="mt-8">
          <a
            href="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create an Account
          </a>
          <a
            href="/recipes"
            className="ml-4 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Browse Recipes
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;