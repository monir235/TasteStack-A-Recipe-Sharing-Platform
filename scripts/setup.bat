@echo off
echo 🚀 TasteStack Setup Script
echo.

echo 1. Setting up Backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo Running migrations...
python manage.py migrate
cd ..

echo.
echo 2. Setting up Frontend...
cd frontend
echo Installing Node.js dependencies...
npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo   Backend: cd backend && venv\Scripts\activate && python manage.py runserver
echo   Frontend: cd frontend && npm start
echo.
echo 🐳 Or use Docker:
echo   SQLite: docker\run-sqlite.bat
echo   PostgreSQL: docker\run-postgres.bat