#!/bin/bash
# Build frontend
cd frontend
npm install
npm run build

# Move build to Django static
cd ..
rm -rf backend/static/react
mkdir -p backend/static/react
cp -r frontend/build/* backend/static/react/

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Run migrations
python manage.py migrate
python manage.py collectstatic --noinput