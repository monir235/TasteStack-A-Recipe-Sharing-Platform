# 🐳 TasteStack Docker Guide

## 🚀 Quick Start Options

### Option 1: SQLite (Simple & Fast)
```bash
# Start with SQLite
run-sqlite.bat

# Or manually
docker-compose -f docker-compose.sqlite.yml up --build

# Stop
stop-sqlite.bat
```

### Option 2: PostgreSQL (Production Ready)
```bash
# Start with PostgreSQL
run-postgres.bat

# Or manually
docker-compose -f docker-compose.postgres.yml up --build

# Stop
stop-postgres.bat
```

### Option 3: Default (SQLite)
```bash
# Uses main docker-compose.yml (defaults to SQLite)
docker-compose up --build
```

## 📊 Database Comparison

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Setup** | ✅ Simple | ⚡ Complex |
| **Performance** | 🔥 Fast for small apps | 🚀 Better for large apps |
| **Memory** | 💾 Low usage | 📈 Higher usage |
| **Production** | ⚠️ Limited | ✅ Recommended |
| **Containers** | 2 services | 3 services |

## 🔄 Switching Between Databases

**From SQLite to PostgreSQL:**
```bash
stop-sqlite.bat
run-postgres.bat
```

**From PostgreSQL to SQLite:**
```bash
stop-postgres.bat
run-sqlite.bat
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **PostgreSQL** (when used): localhost:5432

## 🛠️ Development vs Production

**Development (SQLite):**
- Fast startup
- No external dependencies
- Perfect for testing

**Production (PostgreSQL):**
- Better performance
- Data integrity
- Scalable
- Industry standard

## 📝 Notes

- Data persists in Docker volumes
- SQLite file is stored in backend container
- PostgreSQL data is stored in `postgres_data` volume
- Media files are shared via `media_volume`