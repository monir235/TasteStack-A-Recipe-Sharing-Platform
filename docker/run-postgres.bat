@echo off
echo 🐘 Starting TasteStack with PostgreSQL...
echo ⚡ Production-ready database setup
echo.
cd /d "%~dp0"
docker-compose -f docker-compose.postgres.yml up --build