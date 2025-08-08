import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                TasteStack
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Discover, share, and enjoy delicious recipes from food enthusiasts around the world.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://github.com/tastestack"
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-all duration-300 shadow-sm hover:shadow-md"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://twitter.com/tastestack"
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-all duration-300 shadow-sm hover:shadow-md"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/tastestack"
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-all duration-300 shadow-sm hover:shadow-md"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.084 5.52.198 5.012.374a6.5 6.5 0 00-2.346 1.508 6.5 6.5 0 00-1.508 2.346C1.16 4.736 1.046 5.31 1.01 6.258.974 7.206.96 7.613.96 11.234c0 3.621.014 4.028.05 4.976.035.947.149 1.521.325 2.03a6.5 6.5 0 001.508 2.345 6.5 6.5 0 002.346 1.508c.509.176 1.083.29 2.03.326.948.035 1.355.049 4.976.049 3.621 0 4.028-.014 4.976-.05.947-.035 1.521-.149 2.03-.325a6.5 6.5 0 002.345-1.508 6.5 6.5 0 001.508-2.346c.176-.509.29-1.083.326-2.03.035-.948.049-1.355.049-4.976 0-3.621-.014-4.028-.05-4.976-.035-.947-.149-1.521-.325-2.03a6.5 6.5 0 00-1.508-2.346A6.5 6.5 0 0018.262.374c-.509-.176-1.083-.29-2.03-.326C15.284.013 14.877 0 11.256 0h.761zm-.099 1.626c3.539 0 3.959.014 4.85.048.861.035 1.328.161 1.639.268.412.16.706.352.969.615.263.263.455.557.615.97.107.31.233.777.268 1.638.034.89.048 1.311.048 4.85 0 3.539-.014 3.959-.048 4.85-.035.861-.161 1.328-.268 1.639a2.878 2.878 0 01-.615.969 2.878 2.878 0 01-.97.615c-.31.107-.777.233-1.638.268-.89.034-1.311.048-4.85.048-3.539 0-3.959-.014-4.85-.048-.861-.035-1.328-.161-1.639-.268a2.878 2.878 0 01-.969-.615 2.878 2.878 0 01-.615-.97c-.107-.31-.233-.777-.268-1.638-.034-.89-.048-1.311-.048-4.85 0-3.539.014-3.959.048-4.85.035-.861.161-1.328.268-1.639.16-.412.352-.706.615-.969.263-.263.557-.455.97-.615.31-.107.777-.233 1.638-.268.89-.034 1.311-.048 4.85-.048l.002-.002z" />
                  <path fillRule="evenodd" d="M12.017 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12.017 15.8a3.637 3.637 0 110-7.274 3.637 3.637 0 010 7.274z" />
                  <path d="M19.846 5.595a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/recipes" className="text-gray-600 hover:text-violet-600 transition-colors duration-200">Browse Recipes</Link></li>
              <li><Link to="/create-recipe" className="text-gray-600 hover:text-violet-600 transition-colors duration-200">Share Recipe</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 hover:text-violet-600 transition-colors duration-200">Dashboard</Link></li>
              <li><Link to="/profile" className="text-gray-600 hover:text-violet-600 transition-colors duration-200">Profile</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-violet-600 transition-colors duration-200">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-violet-600 transition-colors duration-200">Contact</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-violet-600 transition-colors duration-200">Help Center</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-violet-600 transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              © {currentYear} TasteStack, Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Made with passion for food lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
