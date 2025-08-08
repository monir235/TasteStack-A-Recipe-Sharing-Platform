# TasteStack Project Dependencies

This document outlines all the dependencies required for the TasteStack Recipe Sharing Platform.

## Project Structure
```
TasteStack/
├── backend/           # Django REST API
├── frontend/          # React Frontend Application
└── DEPENDENCIES.md    # This file
```

## System Requirements

### Backend Requirements
- **Python**: 3.9+ (recommended: 3.11+)
- **pip**: Latest version
- **Virtual Environment**: venv or virtualenv
- **Database**: SQLite (development) / PostgreSQL (production)

### Frontend Requirements
- **Node.js**: 18.0+ (recommended: 20.0+)
- **npm**: 9.0+ or **yarn**: 1.22+
- **Modern Browser**: Chrome 88+, Firefox 85+, Safari 14+

## Backend Dependencies

### Core Framework (requirements.txt)
```
Django==5.2.1                    # Web framework
djangorestframework==3.16.1      # REST API framework
djangorestframework-simplejwt==5.5.0  # JWT authentication
django-cors-headers==4.7.0       # CORS support
django-filter==25.1              # API filtering
Pillow==11.3.0                   # Image processing
```

### Development Dependencies (requirements-dev.txt)
```
django-debug-toolbar==4.4.6      # Debug toolbar
django-extensions==3.2.3         # Additional management commands
ipython==8.30.0                  # Enhanced Python shell
python-dotenv==1.0.1             # Environment variables
pytest==8.3.4                    # Testing framework
pytest-django==4.9.0             # Django testing integration
black==25.8.0                    # Code formatting
flake8==7.1.1                    # Code linting
isort==5.14.4                    # Import sorting
```

### Production Dependencies (requirements-prod.txt)
```
gunicorn==23.0.0                 # WSGI server
psycopg2-binary==2.9.10          # PostgreSQL adapter
redis==5.2.1                     # Caching & sessions
django-redis==5.4.0              # Redis cache backend
celery==5.4.0                    # Background tasks
django-storages==1.14.5          # Cloud storage
whitenoise==6.9.0                # Static file serving
sentry-sdk==2.22.0               # Error tracking
```

## Frontend Dependencies

### Core Dependencies (package.json)
```json
{
  "react": "^18.3.1",              // UI library
  "react-dom": "^18.3.1",         // DOM rendering
  "react-router-dom": "^6.30.1",  // Client-side routing
  "react-scripts": "5.0.1",       // Build toolchain
  "tailwindcss": "^3.4.17",       // CSS framework
  "axios": "^1.7.9",              // HTTP client
  "js-cookie": "^3.0.5"           // Cookie management
}
```

### UI & Animation Libraries
```json
{
  "@headlessui/react": "^2.3.1",         // Accessible UI components
  "@heroicons/react": "^2.2.0",          // Icon library
  "framer-motion": "^11.15.0",           // Animation library
  "react-hot-toast": "^2.4.1",           // Toast notifications
  "react-loading-skeleton": "^3.5.0",    // Loading skeletons
  "clsx": "^2.1.1"                       // Conditional classes
}
```

### Development Tools
```json
{
  "@testing-library/react": "^16.1.0",   // React testing
  "eslint": "^8.57.1",                   // Code linting
  "prettier": "^3.4.2",                  // Code formatting
  "husky": "^9.1.7",                     // Git hooks
  "lint-staged": "^15.2.11"              // Pre-commit checks
}
```

## Installation Instructions

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# For development
pip install -r requirements-dev.txt

# For production
pip install -r requirements-prod.txt
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Or using yarn
yarn install
```

## Development Environment Setup

### Backend Environment Variables
Create `.env` file in backend directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

## Build Commands

### Backend Commands
```bash
# Run development server
python manage.py runserver

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
pytest

# Format code
black .
isort .
```

### Frontend Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## Production Deployment

### Backend Production Setup
1. Set `DEBUG=False` in settings
2. Configure PostgreSQL database
3. Set up Redis for caching
4. Configure static file storage
5. Set up Gunicorn with supervisor
6. Configure nginx reverse proxy
7. Set up SSL certificates

### Frontend Production Build
1. Build optimized bundle: `npm run build`
2. Serve static files with nginx
3. Configure CDN for assets
4. Set up error monitoring

## Maintenance

### Dependency Updates
```bash
# Backend updates
pip list --outdated
pip install --upgrade package-name

# Frontend updates
npm outdated
npm update package-name
```

### Security Audits
```bash
# Backend security check
pip-audit

# Frontend security check
npm audit
npm audit fix
```

## Troubleshooting

### Common Backend Issues
- **Module not found**: Ensure virtual environment is activated
- **Database errors**: Run migrations with `python manage.py migrate`
- **Permission errors**: Check file permissions and ownership

### Common Frontend Issues  
- **Module resolution**: Delete `node_modules` and run `npm install`
- **Build failures**: Clear cache with `npm start -- --reset-cache`
- **Port conflicts**: Change port with `PORT=3001 npm start`

## Support

For dependency-related issues:
1. Check version compatibility
2. Review package documentation
3. Search GitHub issues
4. Contact project maintainers

---
*Last updated: January 2025*
