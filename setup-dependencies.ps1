# TasteStack Dependencies Setup Script
# Run this script to set up all dependencies for both backend and frontend

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   TasteStack Dependencies Setup Script    " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check system requirements
Write-Host "Checking system requirements..." -ForegroundColor Yellow

# Check Python
if (Test-Command python) {
    $pythonVersion = (python --version 2>&1).Split(' ')[1]
    Write-Host "✓ Python $pythonVersion found" -ForegroundColor Green
} elseif (Test-Command python3) {
    $pythonVersion = (python3 --version 2>&1).Split(' ')[1]
    Write-Host "✓ Python3 $pythonVersion found" -ForegroundColor Green
    Set-Alias python python3
} else {
    Write-Host "✗ Python not found. Please install Python 3.9+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Check Node.js
if (Test-Command node) {
    $nodeVersion = (node --version 2>&1).TrimStart('v')
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
if (Test-Command npm) {
    $npmVersion = (npm --version 2>&1)
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found. Please install npm (usually comes with Node.js)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Backend setup
Write-Host "Setting up Backend Dependencies..." -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow

if (Test-Path "backend") {
    Set-Location "backend"
    
    # Check if virtual environment exists
    if (-Not (Test-Path "venv")) {
        Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
        python -m venv venv
    }
    
    # Activate virtual environment
    Write-Host "Activating virtual environment..." -ForegroundColor Cyan
    & "venv\Scripts\Activate.ps1"
    
    # Upgrade pip
    Write-Host "Upgrading pip..." -ForegroundColor Cyan
    python -m pip install --upgrade pip
    
    # Install base dependencies
    Write-Host "Installing base dependencies..." -ForegroundColor Cyan
    pip install -r requirements.txt
    
    # Ask for development dependencies
    $installDev = Read-Host "Install development dependencies? (y/n) [y]"
    if ($installDev -eq "" -or $installDev.ToLower() -eq "y") {
        Write-Host "Installing development dependencies..." -ForegroundColor Cyan
        pip install -r requirements-dev.txt
    }
    
    # Ask for production dependencies
    $installProd = Read-Host "Install production dependencies? (y/n) [n]"
    if ($installProd.ToLower() -eq "y") {
        Write-Host "Installing production dependencies..." -ForegroundColor Cyan
        pip install -r requirements-prod.txt
    }
    
    # Run migrations
    Write-Host "Running database migrations..." -ForegroundColor Cyan
    python manage.py migrate
    
    Write-Host "✓ Backend setup complete!" -ForegroundColor Green
    Set-Location ".."
} else {
    Write-Host "✗ Backend directory not found!" -ForegroundColor Red
}

Write-Host ""

# Frontend setup
Write-Host "Setting up Frontend Dependencies..." -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow

if (Test-Path "frontend") {
    Set-Location "frontend"
    
    # Check if node_modules exists
    if (Test-Path "node_modules") {
        $reinstall = Read-Host "node_modules exists. Reinstall dependencies? (y/n) [n]"
        if ($reinstall.ToLower() -eq "y") {
            Write-Host "Removing existing node_modules..." -ForegroundColor Cyan
            Remove-Item -Recurse -Force "node_modules"
            if (Test-Path "package-lock.json") {
                Remove-Item -Force "package-lock.json"
            }
        }
    }
    
    # Install dependencies
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
    
    # Ask to run audit fix
    $auditFix = Read-Host "Run security audit and fix? (y/n) [y]"
    if ($auditFix -eq "" -or $auditFix.ToLower() -eq "y") {
        Write-Host "Running security audit..." -ForegroundColor Cyan
        npm audit fix
    }
    
    Write-Host "✓ Frontend setup complete!" -ForegroundColor Green
    Set-Location ".."
} else {
    Write-Host "✗ Frontend directory not found!" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "Setup Summary" -ForegroundColor Yellow
Write-Host "=============" -ForegroundColor Yellow

if (Test-Path "backend/venv") {
    Write-Host "✓ Backend virtual environment created" -ForegroundColor Green
}

if (Test-Path "backend/db.sqlite3") {
    Write-Host "✓ Backend database initialized" -ForegroundColor Green
}

if (Test-Path "frontend/node_modules") {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend && venv\Scripts\Activate.ps1 && python manage.py runserver" -ForegroundColor White
Write-Host "2. Frontend: cd frontend && npm start" -ForegroundColor White
Write-Host "3. Visit: http://localhost:3000 (frontend) and http://localhost:8000 (backend)" -ForegroundColor White

Write-Host ""
Write-Host "For more information, see DEPENDENCIES.md" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Setup complete! Happy coding! 🚀" -ForegroundColor Green
