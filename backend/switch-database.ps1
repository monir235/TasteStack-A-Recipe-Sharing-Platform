# TasteStack Database Switcher
# PowerShell script to help switch between SQLite and PostgreSQL

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("sqlite", "postgresql", "postgres")]
    [string]$DatabaseType,
    
    [switch]$Migrate,
    [switch]$Backup,
    [switch]$Help
)

# Show help
if ($Help) {
    Write-Host @"
TasteStack Database Switcher

USAGE:
    .\switch-database.ps1 -DatabaseType <sqlite|postgresql> [OPTIONS]

OPTIONS:
    -DatabaseType    Target database type (sqlite or postgresql)
    -Migrate         Automatically run migrations after switching
    -Backup          Backup current database before switching
    -Help            Show this help message

EXAMPLES:
    .\switch-database.ps1 -DatabaseType sqlite
    .\switch-database.ps1 -DatabaseType postgresql -Migrate
    .\switch-database.ps1 -DatabaseType sqlite -Backup -Migrate

REQUIREMENTS:
    - Python environment with Django
    - PostgreSQL server (for PostgreSQL option)
    - .env file in backend directory

"@
    exit 0
}

# Normalize database type
$DatabaseType = $DatabaseType.ToLower()
if ($DatabaseType -eq "postgres") {
    $DatabaseType = "postgresql"
}

Write-Host "🔄 TasteStack Database Switcher" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if we're in the right directory
$backendPath = "."
$envPath = Join-Path $backendPath ".env"

if (-not (Test-Path $envPath)) {
    Write-Host "❌ Error: .env file not found in current directory" -ForegroundColor Red
    Write-Host "Please run this script from the backend directory" -ForegroundColor Yellow
    exit 1
}

# Backup current database if requested
if ($Backup) {
    Write-Host "💾 Creating database backup..." -ForegroundColor Yellow
    
    $backupDir = "database_backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    
    # Backup SQLite database if it exists
    if (Test-Path "db.sqlite3") {
        $sqliteBackup = Join-Path $backupDir "db_sqlite3_backup_$timestamp.db"
        Copy-Item "db.sqlite3" $sqliteBackup
        Write-Host "✅ SQLite database backed up to: $sqliteBackup" -ForegroundColor Green
    }
    
    # For PostgreSQL, you might want to use pg_dump
    Write-Host "📝 Note: For PostgreSQL backups, use pg_dump manually" -ForegroundColor Cyan
}

# Read current .env file
$envContent = Get-Content $envPath

# Update DATABASE_ENGINE in .env file
Write-Host "📝 Updating .env configuration..." -ForegroundColor Yellow

$newEnvContent = @()
$engineUpdated = $false

foreach ($line in $envContent) {
    if ($line -match "^DATABASE_ENGINE=") {
        $newEnvContent += "DATABASE_ENGINE=$DatabaseType"
        $engineUpdated = $true
        Write-Host "   DATABASE_ENGINE set to: $DatabaseType" -ForegroundColor Green
    } else {
        $newEnvContent += $line
    }
}

# Add DATABASE_ENGINE if it wasn't found
if (-not $engineUpdated) {
    $newEnvContent += "DATABASE_ENGINE=$DatabaseType"
    Write-Host "   Added DATABASE_ENGINE=$DatabaseType" -ForegroundColor Green
}

# Write updated .env file
$newEnvContent | Set-Content $envPath

# Show configuration requirements
if ($DatabaseType -eq "postgresql") {
    Write-Host "`n⚙️  PostgreSQL Configuration Required:" -ForegroundColor Yellow
    Write-Host "   Make sure these variables are set in your .env file:" -ForegroundColor Cyan
    Write-Host "   - POSTGRES_DB=tastestack_db"
    Write-Host "   - POSTGRES_USER=tastestack_user"
    Write-Host "   - POSTGRES_PASSWORD=your_secure_password"
    Write-Host "   - POSTGRES_HOST=localhost"
    Write-Host "   - POSTGRES_PORT=5432"
    
    Write-Host "`n🗄️  PostgreSQL Server Requirements:" -ForegroundColor Yellow
    Write-Host "   1. PostgreSQL server must be running"
    Write-Host "   2. Database 'tastestack_db' should exist"
    Write-Host "   3. User 'tastestack_user' should have access"
    
    Write-Host "`n💡 To create PostgreSQL database:" -ForegroundColor Cyan
    Write-Host "   createdb -U postgres tastestack_db"
    Write-Host "   psql -U postgres -c `"CREATE USER tastestack_user WITH PASSWORD 'your_password';`""
    Write-Host "   psql -U postgres -c `"GRANT ALL PRIVILEGES ON DATABASE tastestack_db TO tastestack_user;`""
}

# Check database configuration
Write-Host "`n🔍 Checking database configuration..." -ForegroundColor Yellow

try {
    $checkResult = python manage.py checkdb 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database configuration check passed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Database configuration warnings:" -ForegroundColor Yellow
        Write-Host $checkResult -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error checking database configuration: $_" -ForegroundColor Red
}

# Run migrations if requested
if ($Migrate) {
    Write-Host "`n📊 Running database migrations..." -ForegroundColor Yellow
    
    try {
        Write-Host "   Creating migrations..." -ForegroundColor Cyan
        python manage.py makemigrations
        
        Write-Host "   Applying migrations..." -ForegroundColor Cyan
        python manage.py migrate
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migrations completed successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Migration errors occurred" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error running migrations: $_" -ForegroundColor Red
    }
}

# Final status check
Write-Host "`n📋 Final Status:" -ForegroundColor Cyan
try {
    python manage.py checkdb --test-connection
} catch {
    Write-Host "Could not perform final status check" -ForegroundColor Yellow
}

Write-Host "`n🎉 Database switch completed!" -ForegroundColor Green
Write-Host "Current database type: $DatabaseType" -ForegroundColor White

# Next steps
Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   • Test your application: python manage.py runserver"
Write-Host "   • Check database status: python manage.py checkdb --verbose"
if (-not $Migrate) {
    Write-Host "   • Run migrations: python manage.py migrate"
}
Write-Host "   • Create superuser (if needed): python manage.py createsuperuser"
