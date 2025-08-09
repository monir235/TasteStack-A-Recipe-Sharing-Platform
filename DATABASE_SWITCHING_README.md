# Database Configuration - Quick Reference

TasteStack now supports both SQLite and PostgreSQL with easy switching between them.

## 🚀 Quick Start

### Option 1: Using SQLite (Default - No setup required)
```bash
cd backend
# SQLite is already configured - just run migrations
python manage.py migrate
python manage.py runserver
```

### Option 2: Using PostgreSQL
```bash
cd backend
# Copy PostgreSQL template
copy .env.postgresql .env

# Edit .env and set your PostgreSQL password
# Then run:
python manage.py migrate
python manage.py runserver
```

## 🔄 Easy Database Switching

### Using the Switch Script (Recommended)
```powershell
cd backend

# Switch to SQLite with automatic migration
.\switch-database.ps1 -DatabaseType sqlite -Migrate

# Switch to PostgreSQL with backup and migration
.\switch-database.ps1 -DatabaseType postgresql -Backup -Migrate
```

### Manual Switching
```bash
# Edit .env file and change:
DATABASE_ENGINE=postgresql  # or sqlite

# Run migrations
python manage.py migrate
```

## ⚙️ Configuration Options

### Environment Variables (.env file)

| Variable | Options | Description |
|----------|---------|-------------|
| `DATABASE_ENGINE` | `sqlite`, `postgresql` | Database type |
| `POSTGRES_DB` | Database name | Required for PostgreSQL |
| `POSTGRES_USER` | Username | Required for PostgreSQL |
| `POSTGRES_PASSWORD` | Password | Required for PostgreSQL |
| `POSTGRES_HOST` | Host address | Default: `localhost` |
| `POSTGRES_PORT` | Port number | Default: `5432` |

## 🔍 Database Status Check

```bash
cd backend

# Quick check
python manage.py checkdb

# Detailed information
python manage.py checkdb --verbose

# Test connection
python manage.py checkdb --test-connection
```

## 📊 PostgreSQL Setup (One-time)

### Install PostgreSQL
- **Windows**: Download from [PostgreSQL.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Ubuntu**: `sudo apt install postgresql`

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE tastestack_db;
CREATE USER tastestack_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE tastestack_db TO tastestack_user;
\q
```

## 📁 Configuration Files

- `.env` - Current environment configuration
- `.env.example` - Template for SQLite setup
- `.env.postgresql` - Template for PostgreSQL setup
- `DATABASE_CONFIGURATION.md` - Complete documentation

## 🛠️ Troubleshooting

### Common Issues
1. **PostgreSQL connection failed**: Check if PostgreSQL service is running
2. **Permission denied**: Verify database user permissions
3. **Database doesn't exist**: Create the database first

### Quick Fixes
```bash
# Check database status
python manage.py checkdb --verbose

# Reset migrations (if needed)
python manage.py migrate --fake-initial

# Create superuser
python manage.py createsuperuser
```

## 📚 Need More Help?

- Read the complete guide: `backend/DATABASE_CONFIGURATION.md`
- Check Django database documentation
- Use the database diagnostic command: `python manage.py checkdb --verbose`

---

**Current Setup**: Your project is currently configured to use **SQLite by default**. PostgreSQL support is ready to use whenever you need it.
