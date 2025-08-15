@echo off
echo 🛑 Stopping PostgreSQL setup...
cd /d "%~dp0"
docker-compose -f docker-compose.postgres.yml down