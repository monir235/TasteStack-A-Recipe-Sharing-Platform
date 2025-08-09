# Database Configuration Guide

TasteStack supports both SQLite and PostgreSQL databases with easy switching between them using environment variables.

## Quick Start

### Using SQLite (Default)
```bash
# Set in .env file
DATABASE_ENGINE=sqlite

# Run migrations
python manage.py migrate
```

### Using PostgreSQL
```bash
# Set in .env file
DATABASE_ENGINE=postgresql
POSTGRES_DB=tastestack_db
POSTGRES_USER=tastestack_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Run migrations
python manage.py migrate
```

## Environment Configuration

### .env File Structure

The `.env` file in your backend directory controls the database configuration:

```env
# Django Configuration
DEBUG=True
SECRET_KEY=your_secret_key_here

# Database Configuration - Choose one engine
DATABASE_ENGINE=sqlite  # or 'postgresql'

# PostgreSQL Configuration (only needed if using PostgreSQL)
POSTGRES_DB=tastestack_db
POSTGRES_USER=tastestack_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Alternative: Use DATABASE_URL for deployment
# DATABASE_URL=postgresql://user:password@localhost:5432/database_name

# Other settings
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_ENGINE` | Database type: `sqlite` or `postgresql` | `sqlite` | No |
| `DATABASE_URL` | Full database URL (overrides other settings) | None | No |
| `POSTGRES_DB` | PostgreSQL database name | None | Yes (for PostgreSQL) |
| `POSTGRES_USER` | PostgreSQL username | None | Yes (for PostgreSQL) |
| `POSTGRES_PASSWORD` | PostgreSQL password | None | Yes (for PostgreSQL) |
| `POSTGRES_HOST` | PostgreSQL host | `localhost` | No |
| `POSTGRES_PORT` | PostgreSQL port | `5432` | No |

## Switching Databases

### Method 1: Using the Switch Script (Recommended)

```powershell
# Switch to SQLite
.\switch-database.ps1 -DatabaseType sqlite -Migrate

# Switch to PostgreSQL  
.\switch-database.ps1 -DatabaseType postgresql -Migrate

# Switch with backup
.\switch-database.ps1 -DatabaseType postgresql -Backup -Migrate

# Get help
.\switch-database.ps1 -Help
```

### Method 2: Manual Configuration

1. **Edit .env file**
   ```bash
   # Change DATABASE_ENGINE value
   DATABASE_ENGINE=postgresql  # or sqlite
   ```

2. **Update PostgreSQL settings** (if switching to PostgreSQL)
   ```bash
   POSTGRES_DB=tastestack_db
   POSTGRES_USER=tastestack_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

3. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

### Method 3: Using DATABASE_URL

For deployment or advanced configuration, you can use a single DATABASE_URL:

```bash
# SQLite
DATABASE_URL=sqlite:///./db.sqlite3

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/database_name

# PostgreSQL with SSL
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

## PostgreSQL Setup

### Installing PostgreSQL

#### Windows (using Chocolatey)
```powershell
choco install postgresql
```

#### Windows (using installer)
Download from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Creating Database and User

```bash
# Connect as postgres user
sudo -u postgres psql

# Or on Windows
psql -U postgres

# Create database
CREATE DATABASE tastestack_db;

# Create user
CREATE USER tastestack_user WITH PASSWORD 'your_secure_password_here';

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE tastestack_db TO tastestack_user;

# Exit
\q
```

### Alternative PostgreSQL Setup Commands

```bash
# Using createdb and createuser commands
createdb -U postgres tastestack_db
createuser -U postgres -P tastestack_user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tastestack_db TO tastestack_user;"
```

## Database Management Commands

### Check Database Configuration

```bash
# Basic check
python manage.py checkdb

# Detailed information
python manage.py checkdb --verbose

# Test connection
python manage.py checkdb --test-connection
```

### Migration Commands

```bash
# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations

# Migrate specific app
python manage.py migrate accounts

# Fake migration (mark as applied without running)
python manage.py migrate --fake accounts 0001
```

### Data Management

```bash
# Create superuser
python manage.py createsuperuser

# Load fixtures
python manage.py loaddata fixtures/sample_data.json

# Dump data
python manage.py dumpdata accounts.User --indent 2 > users.json

# Django shell
python manage.py shell
```

## Common Issues and Solutions

### 1. PostgreSQL Connection Errors

**Error**: `psycopg2.OperationalError: FATAL: password authentication failed`

**Solutions**:
- Check PostgreSQL credentials in `.env`
- Verify PostgreSQL is running: `pg_ctl status`
- Check PostgreSQL authentication in `pg_hba.conf`

### 2. Database Permission Errors

**Error**: `permission denied for database tastestack_db`

**Solution**:
```bash
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tastestack_db TO tastestack_user;"
psql -U postgres -c "ALTER USER tastestack_user CREATEDB;"
```

### 3. Migration Conflicts

**Error**: `Migration conflicts detected`

**Solutions**:
```bash
# Delete migration files (keep __init__.py)
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# Create fresh migrations
python manage.py makemigrations
python manage.py migrate
```

### 4. SQLite Database Locked

**Error**: `database is locked`

**Solutions**:
- Stop all Django processes
- Check for any open database connections
- Restart your development server

## Best Practices

### Development
- Use SQLite for local development
- Keep `.env` in `.gitignore`
- Use sample data fixtures for testing

### Staging/Production
- Use PostgreSQL for staging and production
- Use environment variables instead of `.env` files
- Enable connection pooling
- Regular database backups

### Security
- Use strong passwords for database users
- Limit database user permissions
- Use SSL connections in production
- Rotate database credentials regularly

## Environment-Specific Configuration

### Development
```env
DATABASE_ENGINE=sqlite
DEBUG=True
SHOW_DB_INFO=true
```

### Staging
```env
DATABASE_ENGINE=postgresql
DEBUG=False
POSTGRES_DB=tastestack_staging
POSTGRES_HOST=staging-db.example.com
```

### Production
```env
DATABASE_ENGINE=postgresql
DEBUG=False
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/tastestack_prod
```

## Backup and Recovery

### SQLite Backup
```bash
# Copy database file
cp db.sqlite3 backups/db_backup_$(date +%Y%m%d_%H%M%S).sqlite3

# Using Django dumpdata
python manage.py dumpdata --indent 2 > backup_$(date +%Y%m%d_%H%M%S).json
```

### PostgreSQL Backup
```bash
# Database dump
pg_dump -U tastestack_user -h localhost tastestack_db > backup.sql

# Restore
psql -U tastestack_user -h localhost tastestack_db < backup.sql

# Using Django
python manage.py dumpdata --indent 2 > backup.json
python manage.py loaddata backup.json
```

## Testing Database Configuration

### Unit Tests
```python
# In your test settings
if 'test' in sys.argv:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
```

### Integration Tests
```bash
# Test with different databases
DATABASE_ENGINE=sqlite python manage.py test
DATABASE_ENGINE=postgresql python manage.py test
```

## Monitoring and Performance

### Database Performance
- Monitor query execution time
- Use Django Debug Toolbar in development
- Implement database connection pooling
- Regular VACUUM operations for PostgreSQL

### Logging
```python
# In settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'django_db.log',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

## Troubleshooting

Run the database diagnostics:

```bash
# Complete database check
python manage.py checkdb --verbose

# Check Django configuration
python manage.py check --database default

# Test migrations
python manage.py showmigrations

# SQL debug
python manage.py dbshell
```

For additional help, check the Django documentation on [databases](https://docs.djangoproject.com/en/stable/ref/databases/) and [migrations](https://docs.djangoproject.com/en/stable/topics/migrations/).
