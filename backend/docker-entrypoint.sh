#!/bin/bash

echo "🚀 Starting TasteStack Backend..."

if [ "$USE_POSTGRES" = "1" ]; then
    echo "🐘 Using PostgreSQL database"
    echo "⏳ Waiting for PostgreSQL to be ready..."
    while ! nc -z db 5432; do
        sleep 1
    done
    echo "✅ PostgreSQL is ready"
elif [ "$USE_SQLITE" = "1" ]; then
    echo "🗃️ Using SQLite database"
else
    echo "🗃️ Using default SQLite database"
fi

echo "📊 Running database migrations..."
python manage.py migrate

echo "🌟 Starting Django server..."
python manage.py runserver 0.0.0.0:8000