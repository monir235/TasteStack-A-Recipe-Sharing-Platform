# TasteStack Installation Guide

Complete installation and setup guide for developers, contributors, and system administrators.

## Table of Contents
1. [Quick Start](#quick-start)
2. [System Requirements](#system-requirements)
3. [Development Environment Setup](#development-environment-setup)
4. [Production Deployment](#production-deployment)
5. [Configuration Options](#configuration-options)
6. [Database Setup](#database-setup)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Configuration](#advanced-configuration)

---

## Quick Start

For developers who want to get TasteStack running quickly:

```bash
# Clone the repository
git clone <repository-url>
cd TasteStack

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend setup (new terminal)
cd ../frontend
npm install
npm start
```

Access the application at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Interface: http://localhost:8000/admin/

---

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10, macOS 10.14+, Ubuntu 18.04+ (or equivalent Linux)
- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for development
- **Internet**: Stable connection for package downloads

### Recommended Development Environment
- **Python**: 3.9+ (for latest Django features)
- **Node.js**: 18+ LTS (for optimal React performance)
- **RAM**: 16GB for comfortable development
- **Storage**: SSD with 10GB+ free space
- **IDE**: Visual Studio Code, PyCharm, or similar

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Development Environment Setup

### 1. Prerequisites Installation

#### Python Installation
**Windows:**
1. Download from [python.org](https://www.python.org/downloads/)
2. Run installer with "Add Python to PATH" checked
3. Verify: `python --version`

**macOS:**
```bash
# Using Homebrew (recommended)
brew install python

# Or download from python.org
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

#### Node.js Installation
**All Platforms:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Install LTS version
3. Verify: `node --version` and `npm --version`

**Alternative (using package managers):**
```bash
# Windows (using Chocolatey)
choco install nodejs

# macOS (using Homebrew)
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Git Installation
**Windows:**
- Download from [git-scm.com](https://git-scm.com/)

**macOS:**
```bash
# Git is included with Xcode Command Line Tools
xcode-select --install

# Or using Homebrew
brew install git
```

**Ubuntu/Debian:**
```bash
sudo apt install git
```

### 2. Project Setup

#### Clone Repository
```bash
git clone <repository-url>
cd TasteStack

# Verify project structure
ls -la
# Should show: backend/, frontend/, docs/, .gitignore, README.md
```

#### Backend Setup (Django)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Verify virtual environment
which python  # Should point to venv directory

# Upgrade pip (recommended)
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Verify Django installation
python -m django --version
```

#### Database Setup
```bash
# Create database tables
python manage.py makemigrations
python manage.py migrate

# Create superuser account (optional but recommended)
python manage.py createsuperuser
# Follow prompts to create admin account
```

#### Start Backend Server
```bash
# Run development server
python manage.py runserver

# Server will start at http://localhost:8000
# API endpoints available at http://localhost:8000/api/
# Admin interface at http://localhost:8000/admin/
```

#### Frontend Setup (React)
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Verify React installation
npm list react

# Start development server
npm start

# Frontend will open at http://localhost:3000
```

### 3. Development Workflow

#### Starting Development Environment
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm start
```

#### Environment Variables (Optional)

**Backend (.env in backend/ directory):**
```env
DEBUG=True
SECRET_KEY=your-development-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend (.env.local in frontend/ directory):**
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

---

## Production Deployment

### 1. Production Requirements
- **Web Server**: Nginx or Apache
- **WSGI Server**: Gunicorn or uWSGI
- **Database**: PostgreSQL (recommended) or MySQL
- **Cache**: Redis (recommended)
- **Process Manager**: systemd or supervisor
- **SSL Certificate**: Let's Encrypt or commercial certificate

### 2. Backend Production Setup

#### Install Production Dependencies
```bash
# In backend directory
pip install gunicorn psycopg2-binary redis

# Update requirements.txt
pip freeze > requirements.txt
```

#### Database Configuration (PostgreSQL)
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'tastestack',
        'USER': 'tastestack_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

#### Production Settings
```python
# settings_production.py
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

STATIC_ROOT = '/var/www/tastestack/static/'
MEDIA_ROOT = '/var/www/tastestack/media/'

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
```

#### Gunicorn Configuration
```bash
# gunicorn.conf.py
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
```

### 3. Frontend Production Build
```bash
cd frontend

# Create production build
npm run build

# Files will be created in build/ directory
# Serve with Nginx or copy to web server
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private.key;

    # Frontend
    location / {
        root /var/www/tastestack/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /var/www/tastestack/static/;
    }

    location /media/ {
        alias /var/www/tastestack/media/;
    }
}
```

---

## Configuration Options

### Backend Configuration

#### Django Settings
```python
# Key settings in settings.py

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Change for production
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'  # Change to your timezone

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Add production URLs
]
```

#### JWT Authentication
```python
# JWT settings
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

### Frontend Configuration

#### Environment Variables
```env
# .env.local
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_APP_NAME=TasteStack
REACT_APP_VERSION=1.0.0
```

#### Build Configuration
```json
// package.json
{
  "homepage": "https://yourdomain.com",
  "scripts": {
    "build": "react-scripts build",
    "build:production": "NODE_ENV=production npm run build"
  }
}
```

---

## Database Setup

### SQLite (Development - Default)
```bash
# No additional setup required
python manage.py migrate
```

### PostgreSQL (Recommended for Production)
```bash
# Install PostgreSQL
# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE tastestack;
CREATE USER tastestack_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE tastestack TO tastestack_user;
\q

# Update Django settings and migrate
python manage.py migrate
```

### MySQL (Alternative)
```bash
# Install MySQL
# Update settings.py with MySQL configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tastestack',
        'USER': 'tastestack_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# Install MySQL client
pip install mysqlclient

# Migrate
python manage.py migrate
```

---

## Troubleshooting

### Common Issues

#### Python/Django Issues
**Issue**: `ModuleNotFoundError: No module named 'django'`
**Solution**: 
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**Issue**: Database migration errors
**Solution**: 
```bash
# Reset database (development only)
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
```

**Issue**: CORS errors in browser
**Solution**: 
```python
# In settings.py, ensure CORS is configured
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
# Or for development only:
CORS_ALLOW_ALL_ORIGINS = True
```

#### Node.js/React Issues
**Issue**: `npm install` fails
**Solution**: 
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Port 3000 already in use
**Solution**: 
```bash
# Kill process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm start
```

#### Permission Issues (Linux/macOS)
```bash
# Fix Python package installation permissions
pip install --user -r requirements.txt

# Fix npm permission issues
sudo chown -R $(whoami) ~/.npm
```

### Performance Issues
- Increase available memory for Node.js: `NODE_OPTIONS=--max_old_space_size=4096 npm start`
- Use SSD for better I/O performance
- Close unnecessary applications during development

### Debugging
```bash
# Django debug mode (development only)
# In settings.py: DEBUG = True

# React debug mode (automatically enabled in development)
# Check browser developer tools for errors

# Verbose Django logging
# Add to settings.py:
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

---

## Advanced Configuration

### Docker Setup (Optional)
```dockerfile
# Dockerfile for backend
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "tastestack.wsgi:application", "--bind", "0.0.0.0:8000"]
```

```dockerfile
# Dockerfile for frontend
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
```

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy TasteStack
on:
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    - name: Run tests
      run: |
        cd backend
        python manage.py test
```

### Monitoring and Logging
```python
# Production logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

---

This installation guide provides comprehensive instructions for setting up TasteStack in various environments. For additional help, refer to the project documentation or create an issue in the repository.
