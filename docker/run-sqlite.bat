@echo off
echo 🗃️ Starting TasteStack with SQLite...
echo ✅ Simple setup, no external database needed
echo.
docker-compose -f docker-compose.sqlite.yml up --build