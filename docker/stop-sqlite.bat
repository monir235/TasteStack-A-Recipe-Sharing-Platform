@echo off
echo 🛑 Stopping SQLite setup...
cd /d "%~dp0"
docker-compose -f docker-compose.sqlite.yml down