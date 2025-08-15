@echo off
echo 🔥 Starting TasteStack Development Servers...
echo.

echo Starting Backend (Django)...
start "TasteStack Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo Starting Frontend (React)...
start "TasteStack Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Development servers starting...
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000