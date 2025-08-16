@echo off
echo Starting TasteStack servers...

start "Backend Server" cmd /k "cd backend && python manage.py runserver"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && npm start"

echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000