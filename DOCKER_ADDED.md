# ✅ Docker Support Added!

## What's New

Your Disaster Management system now has **complete Docker support** for easy deployment!

### Files Added

#### Docker Configuration
- ✅ **`docker-compose.yml`** - Main configuration (production)
- ✅ **`docker-compose.dev.yml`** - Development overrides with hot reload
- ✅ **`backend/Dockerfile`** - Multi-stage build for Spring Boot
- ✅ **`frontend/Dockerfile`** - Multi-stage build for React + Nginx
- ✅ **`frontend/Dockerfile.dev`** - Development with Vite hot reload
- ✅ **`.env.example`** - Environment variables template
- ✅ **`init-db.sql`** - Database initialization with PostGIS

#### Docker Helpers
- ✅ **`docker-start.bat`** - One-click start (Windows)
- ✅ **`docker-start.sh`** - One-click start (Linux/Mac)
- ✅ **`backend/.dockerignore`** - Exclude unnecessary files
- ✅ **`frontend/.dockerignore`** - Exclude unnecessary files
- ✅ **`frontend/nginx.conf`** - Nginx reverse proxy config

#### Configuration
- ✅ **`backend/src/main/resources/application-docker.yml`** - Docker-specific settings

#### Documentation
- ✅ **`DOCKER.md`** - Complete Docker guide (commands, deployment, troubleshooting)
- ✅ **`GETTING_STARTED.md`** - Simple getting started guide
- ✅ **`README.md`** - Updated with Docker instructions

---

## Quick Start Options

### Option 1: Docker (Recommended)

**Windows:**
```cmd
docker-start.bat
```

**Linux/Mac:**
```bash
./docker-start.sh
```

**Manual:**
```bash
docker-compose up -d
```

### Option 2: Manual Setup

Use the existing scripts:
- `RUN_APP.bat` (Windows)
- `SETUP_DATABASE.bat` (Windows)

---

## What Docker Does

### Automatic Setup
- ✅ **PostgreSQL 16 with PostGIS 3.4** - No manual installation!
- ✅ **Spring Boot Backend (Java 17)** - Builds automatically
- ✅ **React Frontend with Nginx** - Builds and serves automatically
- ✅ **Database initialization** - Creates tables automatically
- ✅ **Seed data** - Inserts default users

### Features
- 🐳 **Isolated containers** - No conflicts with system installations
- 🔄 **Hot reload** - Development mode with live updates
- 📊 **Health checks** - Automatic service monitoring
- 🔒 **Security** - Non-root users, minimal images
- 📦 **Volumes** - Persistent data storage
- 🌐 **Networking** - Services communicate seamlessly

---

## Services Overview

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **database** | postgis/postgis:16-3.4 | 5432 | PostgreSQL + PostGIS |
| **backend** | Custom (Java 17 + Spring Boot) | 8080 | REST API |
| **frontend** | Custom (React + Nginx) | 3000 | Web UI |

---

## Docker Commands Cheat Sheet

### Start/Stop
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose down -v            # Stop and remove volumes
docker-compose restart            # Restart all services
docker-compose restart backend    # Restart specific service
```

### Logs
```bash
docker-compose logs -f            # Follow all logs
docker-compose logs -f backend    # Follow backend logs
docker-compose logs --tail=100    # Last 100 lines
```

### Status
```bash
docker-compose ps                 # List containers
docker stats                      # Resource usage
```

### Build
```bash
docker-compose build              # Rebuild all
docker-compose build --no-cache   # Clean rebuild
docker-compose up -d --build      # Rebuild and start
```

### Database
```bash
# Access database
docker-compose exec database psql -U postgres -d Disaster_Management

# Backup
docker-compose exec database pg_dump -U postgres Disaster_Management > backup.sql

# Restore
docker-compose exec -T database psql -U postgres Disaster_Management < backup.sql
```

### Cleanup
```bash
docker system prune -a            # Remove all unused
docker volume prune               # Remove unused volumes
docker image prune -a             # Remove unused images
```

---

## Development Mode

Start with hot reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Features:**
- Frontend hot reload (Vite)
- Backend auto-restart (Spring DevTools)
- Source code mounted as volumes
- Instant feedback on code changes

---

## Production Deployment

### Single Server
```bash
# 1. Configure environment
cp .env.example .env
nano .env

# 2. Start services
docker-compose up -d

# 3. Check health
curl http://localhost:8080/actuator/health
```

### Cloud Platforms

**AWS ECS:**
```bash
ecs-cli compose --file docker-compose.yml up
```

**Azure:**
```bash
az container create --resource-group myGroup --file docker-compose.yml
```

**Google Cloud Run:**
```bash
gcloud run deploy --image gcr.io/project/disaster-mgmt
```

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_PASSWORD=your_secure_password

# JWT (IMPORTANT: Change in production!)
JWT_SECRET=your-256-bit-secret-key

# Twilio (Optional)
TWILIO_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Benefits of Docker

### For Development
- ✅ **Quick setup** - 5 minutes vs 30+ minutes manual
- ✅ **Consistent environment** - Same on all machines
- ✅ **No conflicts** - Isolated from system
- ✅ **Easy cleanup** - Remove everything with one command

### For Production
- ✅ **Scalable** - Easy to scale services independently
- ✅ **Portable** - Deploy anywhere Docker runs
- ✅ **Reproducible** - Same build every time
- ✅ **Version controlled** - Configuration as code

### For Team
- ✅ **Onboarding** - New devs start in minutes
- ✅ **Standardized** - Everyone uses same setup
- ✅ **Documented** - Configuration is self-documenting

---

## File Structure

```
disaster-management/
├── docker-compose.yml           # Main Docker config
├── docker-compose.dev.yml       # Dev overrides
├── .env.example                 # Environment template
├── init-db.sql                  # DB initialization
├── docker-start.bat/sh          # Quick start scripts
├── DOCKER.md                    # Full documentation
├── GETTING_STARTED.md           # Setup guide
│
├── backend/
│   ├── Dockerfile               # Backend image
│   ├── .dockerignore            # Exclude files
│   └── src/main/resources/
│       └── application-docker.yml
│
└── frontend/
    ├── Dockerfile               # Production image
    ├── Dockerfile.dev           # Dev image
    ├── nginx.conf               # Nginx config
    └── .dockerignore            # Exclude files
```

---

## Next Steps

1. ✅ **Try it out:**
   ```bash
   docker-compose up -d
   ```

2. 📖 **Read the docs:**
   - [GETTING_STARTED.md](GETTING_STARTED.md) - Quick start guide
   - [DOCKER.md](DOCKER.md) - Complete Docker documentation
   - [README.md](README.md) - Project overview

3. 🔧 **Configure:**
   - Edit `.env` for your environment
   - Customize `docker-compose.yml` if needed

4. 🚀 **Deploy:**
   - Local: Already done!
   - Cloud: See DOCKER.md deployment section

---

## Comparison: Docker vs Manual

| Task | Docker | Manual |
|------|--------|--------|
| Install PostgreSQL | ✅ Automatic | ⚠️ Manual download |
| Install PostGIS | ✅ Included | ⚠️ Stack Builder/manual |
| Configure database | ✅ Automatic | ⚠️ psql commands |
| Install Java | ✅ Included | ⚠️ Download JDK |
| Build backend | ✅ Automatic | ⚠️ Maven commands |
| Start backend | ✅ Automatic | ⚠️ Run script/command |
| Install Node.js | ✅ Included | ⚠️ Download installer |
| Build frontend | ✅ Automatic | ⚠️ npm install & build |
| Start frontend | ✅ Automatic | ⚠️ npm run dev |
| Setup time | ⏱️ 5 min | ⏱️ 30+ min |
| One command start | ✅ Yes | ❌ No |
| Production ready | ✅ Yes | ⚠️ Needs work |

---

## Troubleshooting

### Docker not starting
```bash
# Check Docker is running
docker info

# Windows: Make sure Docker Desktop is running
# Linux: sudo systemctl start docker
```

### Port conflicts
```bash
# Find what's using the port
netstat -ano | findstr :8080    # Windows
lsof -i :8080                   # Linux/Mac

# Or change port in docker-compose.yml
```

### Build failures
```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database issues
```bash
# Check database logs
docker-compose logs database

# Restart database
docker-compose restart database

# Reset database (removes all data!)
docker-compose down -v
docker-compose up -d
```

---

## Summary

🎉 **Your project now has complete Docker support!**

**What you can do now:**
1. ✅ Start entire stack with one command
2. ✅ No manual PostGIS installation needed
3. ✅ Development mode with hot reload
4. ✅ Production-ready deployment
5. ✅ Easy scaling and cloud deployment

**Recommended path:**
```bash
# Just run this:
docker-compose up -d

# Open browser:
http://localhost:3000
```

That's it! 🚀
