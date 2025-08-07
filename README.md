# TasteStack Recipe Sharing Platform - Frontend

This is the frontend implementation of the TasteStack Recipe Sharing Platform, built with React 18+ and Tailwind CSS.

## Project Overview

TasteStack is a modern, scalable web application that allows users to discover, share, and interact with recipes. The platform provides a clean, responsive interface for food enthusiasts to build a community around cooking and recipe sharing.

## Features Implemented

✅ **User Authentication**
- Login and Registration pages
- Navigation bar with authentication state

✅ **Recipe Management**
- Homepage with featured recipes
- Recipe listing page with search and pagination
- Detailed recipe view with ingredients, instructions, and ratings
- Recipe creation form

✅ **User Dashboard**
- Personal dashboard with user statistics
- List of user's recipes with engagement metrics
- Recent activity feed

✅ **User Profiles**
- User profile pages with bio and statistics
- Recipe listings by user

✅ **Additional Pages**
- About page with company information
- Responsive navigation

## Technology Stack

- **Frontend**: React 18+ with modern hooks
- **Routing**: React Router v6
- **Styling**: Tailwind CSS for responsive design
- **Build Tool**: Create React App (react-scripts)

## Project Structure

```
src/
├── components/
│   └── Navbar.js          # Navigation bar component
├── pages/
│   ├── HomePage.js        # Homepage with featured recipes
│   ├── RecipeListPage.js  # Recipe listing with search
│   ├── RecipeDetailPage.js # Detailed recipe view
│   ├── LoginPage.js       # User login page
│   ├── RegisterPage.js    # User registration page
│   ├── DashboardPage.js   # User dashboard with stats
│   ├── ProfilePage.js     # User profile page
│   ├── CreateRecipePage.js # Recipe creation form
│   └── AboutPage.js       # About page
├── App.js                 # Main app component with routing
├── index.js               # Entry point
└── index.css             # Global styles and Tailwind imports
```

## How to Run

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. The application will be available at `http://localhost:3000`

## Next Steps

To complete the full application, the following components need to be implemented:

1. **Backend Integration**:
   - Connect to Django REST API
   - Implement JWT authentication
   - Add API service layer

2. **Enhanced Features**:
   - Recipe editing functionality
   - User profile editing
   - Comment and rating submission
   - Image upload handling

3. **Advanced Functionality**:
   - Recipe search by ingredients
   - User following system
   - Recipe collections/bookmarks
   - Admin dashboard

## Requirements Coverage

This frontend implementation covers all the user interface requirements specified in the project documentation:

- ✅ Anonymous Users can view homepage, browse recipes, search, and view recipe details
- ✅ Registered Users can like, rate, and comment on recipes
- ✅ Recipe Owners can create recipes (creation form implemented)
- ✅ All pages have responsive design
- ✅ Navigation bar with search functionality
- ✅ Authentication flow (login/register)

Note: Full functionality requires backend API integration.

## Backend Integration

The backend API is now complete and running at `http://localhost:8000`. The frontend is configured to use the real backend API by default.

To use the mock API instead:
1. Set `USE_MOCK_API` to `true` in both `src/services/authService.js` and `src/services/recipeService.js`
2. Restart the frontend development server

See [MOCK_API.md](MOCK_API.md) for detailed instructions on using the mock API.

## Backend Features

The backend includes a complete Django REST API with:

- User authentication using JWT tokens
- Recipe management (create, read, update, delete)
- Recipe rating and commenting system
- Recipe search functionality
- User profile management
- Image upload for recipes and profiles

See the [backend README](tastestack-backend/README.md) for detailed information about the backend API.