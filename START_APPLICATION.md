# Start Disaster Management Application

## Prerequisites Check

### 1. Docker Desktop Status
- ✅ Docker Desktop configured to use E:\Docker
- ✅ C drive has 15+ GB free space
- ✅ Project volumes on E drive

### 2. Configuration Files
- ✅ `.env` file exists in project root
- ✅ `frontend/.env` file exists
- ✅ `backend/.env.example` exists as reference

---

## Quick Start Commands

### Option 1: Start with Docker Compose (Recommended)
```powershell
cd "E:\Projects\Disaster Management"
docker-compose up -d
```

### Option 2: Build Fresh Images First
```powershell
cd "E:\Projects\Disaster Management"
docker-compose build
docker-compose up -d
```

### Option 3: Build with No Cache (If Issues)
```powershell
cd "E:\Projects\Disaster Management"
docker-compose build --no-cache
docker-compose up -d
```

---

## Startup Sequence

### 1. Database (PostgreSQL with PostGIS)
**Container**: `disaster-mgmt-db`
**Port**: 5432
**Health Check**: Automatic (pg_isready)
**Startup Time**: ~10 seconds

### 2. Backend (Spring Boot)
**Container**: `disaster-mgmt-backend`
**Port**: 8080
**Depends On**: Database (waits for healthy status)
**Startup Time**: ~60 seconds
**Health Check**: `http://localhost:8080/actuator/health`

### 3. Frontend (React + Nginx)
**Container**: `disaster-mgmt-frontend`
**Port**: 3000
**Depends On**: Backend
**Startup Time**: ~5 seconds
**Health Check**: `http://localhost:3000/`

---

## Verify Application Status

### Check Container Status
```powershell
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE                          STATUS          PORTS
xxxxxxxxxx     disastermanagement-frontend    Up X minutes    0.0.0.0:3000->80/tcp
xxxxxxxxxx     disastermanagement-backend     Up X minutes    0.0.0.0:8080->8080/tcp
xxxxxxxxxx     postgis/postgis:16-3.4         Up X minutes    0.0.0.0:5432->5432/tcp
```

### Check Logs
```powershell
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Check Health Status
```powershell
docker-compose ps
```

---

## Access the Application

### Frontend (User Interface)
**URL**: http://localhost:3000
- Landing page with login/register
- Issue reporting
- Map view
- User dashboard

### Backend API
**URL**: http://localhost:8080
**Health Check**: http://localhost:8080/actuator/health
**API Base**: http://localhost:8080/api/v1

### Database
**Host**: localhost
**Port**: 5432
**Database**: Disaster_Management
**Username**: postgres
**Password**: Check `.env` file (default: postgres)

**Connection String**:
```
postgresql://postgres:postgres@localhost:5432/Disaster_Management
```

---

## Test the Application

### 1. Register a New User
1. Open http://localhost:3000
2. Click "Register" / "Sign Up"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Password: Test123!
4. Submit

### 2. Login
1. Use registered credentials
2. Or try OTP login if configured

### 3. Report an Issue
1. After login, click "Report Issue"
2. Fill in issue details
3. Select location on map
4. Upload photos (optional)
5. Submit

### 4. View on Map
1. Click "Map View"
2. See all reported issues
3. Click markers for details

---

## Troubleshooting

### Issue: Containers Won't Start
```powershell
# Check for port conflicts
netstat -ano | findstr "3000 8080 5432"

# Stop and remove all containers
docker-compose down

# Start fresh
docker-compose up -d
```

### Issue: Database Connection Failed
```powershell
# Check database logs
docker-compose logs database

# Verify database is healthy
docker exec disaster-mgmt-db pg_isready -U postgres

# Restart database
docker-compose restart database
```

### Issue: Backend Not Responding
```powershell
# Check backend logs
docker-compose logs backend | more

# Common reasons:
# - Database not ready (wait 30 more seconds)
# - Migration errors (check logs for Flyway errors)
# - Port 8080 already in use

# Restart backend
docker-compose restart backend
```

### Issue: Frontend Shows "Cannot Connect"
```powershell
# Check if backend is running
curl http://localhost:8080/actuator/health

# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend
```

### Issue: Build Fails
```powershell
# Clean everything
docker-compose down -v
docker system prune -f

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

---

## Stop the Application

### Stop Containers (Keep Data)
```powershell
docker-compose stop
```

### Stop and Remove Containers (Keep Data)
```powershell
docker-compose down
```

### Stop and Remove Everything (DELETE DATA)
```powershell
docker-compose down -v
```
**⚠️ Warning**: This deletes the database!

---

## Verify Database Data

### Check if Users Exist
```powershell
docker exec disaster-mgmt-db psql -U postgres -d Disaster_Management -c "SELECT COUNT(*) FROM users;"
```

### See All Tables
```powershell
docker exec disaster-mgmt-db psql -U postgres -d Disaster_Management -c "\dt"
```

### Check Database Size
```powershell
docker exec disaster-mgmt-db psql -U postgres -d Disaster_Management -c "SELECT pg_size_pretty(pg_database_size('Disaster_Management'));"
```

---

## Default Test Accounts

After database initialization, check if seed data created default accounts.
Look in `backend/src/main/resources/db/migration/V2__seed_data.sql`

If no seed data exists, register new users through the UI.

---

## Performance Monitoring

### Check Container Resource Usage
```powershell
docker stats
```

### Check Disk Space
```powershell
# C drive
Get-PSDrive C | Select-Object @{Name="FreeGB";Expression={[math]::Round($_.Free/1GB,2)}}

# Docker data on E drive
Get-ChildItem "E:\Docker" -Recurse -File | Measure-Object -Property Length -Sum
```

---

## Next Steps After Startup

1. ✅ Verify all 3 containers are running
2. ✅ Access frontend at http://localhost:3000
3. ✅ Register a test user
4. ✅ Report a test issue
5. ✅ Check if issue appears on map
6. ✅ Test notifications (if configured)
7. ✅ Review backend logs for any warnings

---

## Production Deployment Notes

Before deploying to production:
1. Change all default passwords in `.env`
2. Set secure JWT_SECRET (minimum 256 bits)
3. Configure Twilio for SMS/WhatsApp (optional)
4. Set up HTTPS/SSL certificates
5. Configure proper CORS origins
6. Set up database backups
7. Configure log aggregation
8. Set up monitoring/alerting

