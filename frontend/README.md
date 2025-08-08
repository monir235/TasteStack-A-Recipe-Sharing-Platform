# TasteStack Frontend - React Application

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-purple.svg)](https://vitejs.dev/)

This is the frontend application for the TasteStack Recipe Sharing Platform, built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository (if not already done)
git clone https://github.com/YOUR-USERNAME/tastestack.git
cd tastestack/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service functions
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── styles/         # CSS and styling
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
```

## 🛠️ Development Setup

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_MEDIA_URL=http://localhost:8000
```

### Development Workflow

1. Start the backend server first (see [backend README](../backend/README.md))
2. Start the frontend development server: `npm run dev`
3. Open your browser to `http://localhost:5173`

## 🎨 Features

- **Recipe Discovery**: Browse and search recipes
- **User Authentication**: Register, login, and profile management
- **Recipe Management**: Create, edit, and delete your own recipes
- **Social Features**: Like, rate, and comment on recipes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Image Upload**: Upload recipe and profile images
- **Dark/Light Theme**: Toggle between themes

## 🔧 Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Image Handling**: React Dropzone

For complete setup instructions and advanced usage, see the main project [README](../README.md).
