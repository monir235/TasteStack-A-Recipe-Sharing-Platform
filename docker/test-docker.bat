@echo off
echo Testing TasteStack Docker setup...
echo.
echo 1. Checking Docker configuration...
docker-compose config --quiet
if %errorlevel% neq 0 (
    echo ❌ Docker configuration has errors
    exit /b 1
)
echo ✅ Docker configuration is valid

echo.
echo 2. Building containers (this may take a few minutes)...
docker-compose build --no-cache
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Containers built successfully

echo.
echo 3. Starting services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start services
    exit /b 1
)
echo ✅ Services started

echo.
echo 4. Checking service status...
timeout /t 10 /nobreak > nul
docker-compose ps

echo.
echo 🎉 TasteStack is running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo To stop: docker-compose down