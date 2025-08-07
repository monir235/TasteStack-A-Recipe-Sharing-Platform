# Mock API for TasteStack Frontend

This document explains how to use the mock API for testing the TasteStack frontend without a backend server.

**NOTE: The real backend is now available at http://localhost:8000. To use the real backend, set `USE_MOCK_API` to `false` in both `authService.js` and `recipeService.js`.**

## Overview

The TasteStack frontend includes a mock API implementation that allows you to test all functionality without needing to run a backend server. This is useful for:

1. Testing the frontend during development
2. Demonstrating the application functionality
3. Running the frontend in environments where the backend is not available

## How it Works

The mock API is implemented in `src/services/mockApi.js` and includes mock data for:

- Users
- Recipes
- Comments

The mock API simulates network requests with realistic delays and provides the same interface as the real backend API.

## Configuration

The mock API is enabled by default. You can switch between the mock API and real backend API by changing the `USE_MOCK_API` flag in the following files:

1. `src/services/authService.js`
2. `src/services/recipeService.js`

To use the real backend API, set `USE_MOCK_API` to `false` in both files.

## Demo Credentials

You can use the following credentials to log in:

- Email: `demo@example.com`
- Password: (any password will work for the mock API)

## Mock Data

The mock API includes the following sample data:

### Users
- Demo User (ID: 1)

### Recipes
1. Spaghetti Carbonara
2. Chocolate Chip Cookies
3. Vegetable Stir Fry

Each recipe includes:
- Title
- Description
- Ingredients
- Instructions
- Preparation time
- Cooking time
- Servings
- Difficulty level
- Author information
- Rating
- Like count

## Limitations

The mock API has the following limitations compared to a real backend:

1. Data is not persisted between sessions
2. All operations work with in-memory data only
3. Some advanced features may not be fully implemented

## Testing the Application

To test the application with the mock API:

1. Ensure the development server is running (`npm start`)
2. Navigate to http://localhost:3000
3. Click "Get Started" or "Sign in to your account"
4. Use the demo credentials to log in
5. Explore the application features

All major features should work with the mock API:

- User registration and login
- Recipe browsing and searching
- Recipe viewing with ingredients and instructions
- Recipe creation
- User profile management
- Recipe rating and commenting (simulated)

## Switching to Real Backend

To use the real backend API:

1. Set `USE_MOCK_API` to `false` in both `authService.js` and `recipeService.js`
2. Ensure the backend server is running on `http://localhost:8000`
3. Restart the frontend development server