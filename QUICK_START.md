# 🚀 Quick Start Guide - Disaster Management System

## Your Application is Running! 🎉

### Access Your Application:

- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

---

## Essential Commands

### Starting the Application:
```bash
# Start all services
docker-compose up

# Start in background (detached mode)
docker-compose up -d
```

### Stopping the Application:
```bash
# Stop all services
docker-compose down

# Stop and remove all data (⚠️ WARNING: Deletes everything)
docker-compose down -v
```

### Viewing Logs:
```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend

# View database logs only
docker-compose logs -f database
```

### Checking Status:
```bash
# Check if all containers are running
docker-compose ps

# Check container health
docker-compose ps
```

### Rebuilding After Code Changes:
```bash
# Rebuild and restart everything
docker-compose up --build

# Rebuild only backend
docker-compose up --build backend

# Rebuild only frontend
docker-compose up --build frontend
```

---

## Database Access

### Using Docker:
```bash
# Access PostgreSQL console
docker-compose exec database psql -U postgres -d Disaster_Management

# Run SQL query
docker-compose exec database psql -U postgres -d Disaster_Management -c "SELECT * FROM users;"

# Dump database backup
docker-compose exec database pg_dump -U postgres Disaster_Management > backup.sql

# Restore database
docker-compose exec -T database psql -U postgres Disaster_Management < backup.sql
```

### Using External Tool (pgAdmin, DBeaver, etc.):
```
Host: localhost
Port: 5432
Database: Disaster_Management
Username: postgres
Password: laknight07
```

---

## Project Structure

```
Disaster Management/
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/            # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── Dockerfile
├── init-db.sql        # Database initialization
├── docker-compose.yml # Docker orchestration
├── .env               # Environment variables
└── DEPLOYMENT_SUCCESS.md  # Full documentation
```

---

## Common Tasks

### 1. Update Environment Variables:
Edit `.env` file and restart services:
```bash
# Edit .env file with your favorite editor
notepad .env

# Restart services to apply changes
docker-compose down
docker-compose up -d
```

### 2. View Backend API Endpoints:
```bash
# Health check
curl http://localhost:8080/actuator/health

# Sample API calls (after authentication)
curl http://localhost:8080/api/issues
curl http://localhost:8080/api/departments
```

### 3. Clear and Reset Everything:
```bash
# ⚠️ WARNING: This deletes all data!
docker-compose down -v
docker-compose up --build
```

### 4. Access Container Shell:
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# Database container
docker-compose exec database bash
```

---

## Default Ports

| Service | Internal Port | External Port |
|---------|--------------|---------------|
| Frontend | 80 | 3000 |
| Backend | 8080 | 8080 |
| Database | 5432 | 5432 |

---

## First Time Setup

1. **Access the Frontend**: http://localhost:3000
2. **Register as a new user** (or login if admin user exists)
3. **Create departments** (via admin panel)
4. **Create wards** (via admin panel)
5. **Test issue reporting**

---

## Troubleshooting Quick Fixes

### Port already in use:
```bash
# Option 1: Stop the conflicting process
# Find process on port 3000
netstat -ano | findstr :3000

# Option 2: Change port in docker-compose.yml
# Edit docker-compose.yml and change "3000:80" to "3001:80"
```

### Service won't start:
```bash
# Check logs
docker-compose logs <service-name>

# Restart specific service
docker-compose restart <service-name>

# Rebuild specific service
docker-compose up --build <service-name>
```

### Database connection error:
```bash
# Check database is running
docker-compose ps database

# Check database logs
docker-compose logs database

# Restart database
docker-compose restart database
```

### Out of disk space:
```bash
# Clean unused Docker resources
docker system prune -a

# Remove old images
docker image prune -a

# Remove old volumes (⚠️ WARNING: Deletes data)
docker volume prune
```

---

## System Requirements

- **Docker Desktop**: Latest version
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 5GB free space
- **OS**: Windows 10/11, macOS, or Linux

---

## Quick Reference - Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start services |
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop services |
| `docker-compose down -v` | Stop and delete data |
| `docker-compose ps` | List running services |
| `docker-compose logs` | View logs |
| `docker-compose logs -f` | Follow logs (live) |
| `docker-compose restart` | Restart services |
| `docker-compose build` | Build images |
| `docker-compose up --build` | Rebuild and start |
| `docker-compose exec <service> sh` | Access container |
| `docker-compose top` | Show running processes |
| `docker-compose stop` | Stop without removing |
| `docker-compose start` | Start stopped services |

---

## Environment Variables Reference

Key variables in `.env`:

```properties
# Must Change for Production
JWT_SECRET=<your-secret-key>
POSTGRES_PASSWORD=<your-password>

# Optional Features
SMS_ENABLED=false
TWILIO_ENABLED=false
OTP_ENABLED=true

# AWS S3 (if using cloud storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
```

---

## Performance Tips

1. **Increase Docker Resources**:
   - Docker Desktop → Settings → Resources
   - Increase CPU and Memory allocation

2. **Use Production Mode**:
   - Frontend is already optimized
   - Backend runs with production profile

3. **Database Performance**:
   - Regular VACUUM: `VACUUM ANALYZE;`
   - Monitor slow queries

4. **Monitor Logs**:
   ```bash
   docker stats  # Real-time resource usage
   ```

---

## Getting Help

1. **Check Logs First**: `docker-compose logs`
2. **Review DEPLOYMENT_SUCCESS.md**: Full documentation
3. **Check Docker Status**: `docker-compose ps`
4. **Verify Environment**: `cat .env`

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Change POSTGRES_PASSWORD
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS settings
- [ ] Set up database backups
- [ ] Enable production logging
- [ ] Set up monitoring and alerts
- [ ] Configure rate limiting
- [ ] Review security headers
- [ ] Test thoroughly

---

## Development vs Production

### Current Setup (Development):
- ✅ All services on localhost
- ✅ Hot reload enabled (if using dev mode)
- ✅ Debug logging enabled
- ✅ CORS allows all origins

### For Production:
- Use separate docker-compose.prod.yml
- Enable HTTPS with reverse proxy
- Restrict CORS to your domain
- Use managed database service
- Enable monitoring and logging
- Set up CI/CD pipeline

---

**Happy Coding! 🚀**

For full documentation, see [DEPLOYMENT_SUCCESS.md](./DEPLOYMENT_SUCCESS.md)
