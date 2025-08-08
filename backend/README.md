# TasteStack Backend - Django REST API

[![Django](https://img.shields.io/badge/Django-5.2.1-green.svg)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![DRF](https://img.shields.io/badge/DRF-3.16.1-red.svg)](https://www.django-rest-framework.org/)

This is the backend API server for the TasteStack Recipe Sharing Platform, built with Django and Django REST Framework.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+ 
- pip (package manager)
- Virtual environment (recommended)

### Installation

```bash
# Clone the repository (if not already done)
git clone https://github.com/YOUR-USERNAME/tastestack.git
cd tastestack/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up database
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

## 🏠 Project Structure

```
backend/
├── tastestack/           # Main Django project
│   ├── __init__.py
│   ├── settings.py       # Django settings
│   ├── urls.py          # URL routing
│   ├── wsgi.py          # WSGI config
│   └── asgi.py          # ASGI config
├── recipes/             # Recipe app
│   ├── models.py        # Database models
│   ├── serializers.py   # DRF serializers
│   ├── views.py         # API views
│   ├── urls.py          # App URLs
│   └── admin.py         # Admin interface
├── users/               # User management app
│   ├── models.py        # User models
│   ├── serializers.py   # User serializers
│   ├── views.py         # User views
│   └── urls.py          # User URLs
├── requirements.txt     # Dependencies
├── requirements-dev.txt # Development dependencies
├── requirements-prod.txt# Production dependencies
├── pyproject.toml       # Modern Python project config
└── manage.py           # Django management script
```

For complete setup instructions and advanced usage, see the main project [README](../README.md).

# TasteStack Backend

This is the backend API for the TasteStack Recipe Sharing Platform, built with Django and Django REST Framework.

## Features

- User authentication with JWT tokens
- Recipe management (create, read, update, delete)
- Recipe rating and commenting system
- Recipe search functionality
- User profile management
- Image upload for recipes and profiles

## Technology Stack

- **Backend**: Django 5.2+
- **API**: Django REST Framework
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (for development)
- **Image Processing**: Pillow
- **CORS**: django-cors-headers

## Setup Instructions

1. Navigate to the backend directory:
   ```
   cd tastestack-backend
   ```

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. Run migrations to create the database:
   ```
   python manage.py migrate
   ```

4. Create a superuser (optional):
   ```
   python manage.py createsuperuser
   ```

5. Start the development server:
   ```
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/user/` - Get current user profile
- `PUT /api/auth/user/update/` - Update user profile

### Recipes
- `GET /api/recipes/` - List all recipes
- `POST /api/recipes/` - Create a new recipe
- `GET /api/recipes/{id}/` - Get a specific recipe
- `PUT /api/recipes/{id}/` - Update a recipe
- `DELETE /api/recipes/{id}/` - Delete a recipe
- `POST /api/recipes/{id}/rate/` - Rate a recipe
- `GET /api/recipes/search/` - Search recipes

### Interactions
- `POST /api/interactions/recipes/{id}/like/` - Like a recipe
- `POST /api/interactions/recipes/{id}/unlike/` - Unlike a recipe
- `GET /api/interactions/recipes/{id}/comments/` - Get recipe comments
- `POST /api/interactions/recipes/{id}/comments/add/` - Add a comment to a recipe

## Database Schema

### User
- id (Primary Key)
- username
- email (unique)
- password
- bio
- profile_picture
- date_joined

### Recipe
- id (Primary Key)
- title
- description
- ingredients (JSON)
- instructions (JSON)
- prep_time
- cook_time
- servings
- difficulty
- image
- author (Foreign Key to User)
- created_at
- updated_at

### Rating
- id (Primary Key)
- user (Foreign Key to User)
- recipe (Foreign Key to Recipe)
- rating (1-5)
- created_at
- updated_at

### Like
- id (Primary Key)
- user (Foreign Key to User)
- recipe (Foreign Key to Recipe)
- created_at

### Comment
- id (Primary Key)
- user (Foreign Key to User)
- recipe (Foreign Key to Recipe)
- content
- created_at
- updated_at