# 🚀 Getting Started - Choose Your Path

## Option 1: Docker (Recommended) 🐳

**Easiest way - No manual installation needed!**

### Windows:
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Double-click: **`docker-start.bat`**
3. Wait 1-2 minutes for services to start
4. Open: http://localhost:3000

### Linux/Mac:
```bash
# Make script executable
chmod +x docker-start.sh

# Run it
./docker-start.sh
```

### What Docker Does:
- ✅ Automatically installs PostgreSQL + PostGIS
- ✅ Sets up the database with all tables
- ✅ Starts the backend (Spring Boot)
- ✅ Starts the frontend (React)
- ✅ No need to install Java, Node.js, or PostgreSQL manually!

### Docker Commands:
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart
```

---

## Option 2: Manual Setup (Windows)

**For developers who want more control**

### 1. Install PostGIS

**Option A:** Stack Builder
- Open: Start Menu → PostgreSQL 18 → Application Stack Builder
- Install PostGIS extension

**Option B:** Download manually
- Visit: https://postgis.net/windows_downloads/

**Option C:** Use script
- Double-click: `SETUP_DATABASE.bat`

### 2. Run Backend
```cmd
# Double-click
RUN_APP.bat
```

### 3. Run Frontend
```cmd
cd frontend
npm install
npm run dev
```

---

## Quick Comparison

| Feature | Docker | Manual |
|---------|--------|--------|
| Setup Time | 5 minutes | 20+ minutes |
| PostGIS | ✅ Automatic | ⚠️ Manual install |
| Backend | ✅ Automatic | ⚠️ Manual start |
| Frontend | ✅ Automatic | ⚠️ Manual start |
| Dependencies | ✅ All included | ⚠️ Install separately |
| Isolation | ✅ Containers | ⚠️ System-wide |
| Production Ready | ✅ Yes | ⚠️ Needs config |

---

## After Setup

### Default Login Credentials:

**Admin:**
- Email: `admin@localproblems.in`
- Password: `Admin@123`

**Officer:**
- Email: `officer.kumar@city.gov.in`
- Password: `Officer@123`

### Access Points:

- **Frontend:** http://localhost:3000 (Docker) or http://localhost:5173 (Manual)
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/actuator/health

### Test the API:

```bash
# Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","name":"Test User","role":"CITIZEN"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@localproblems.in","password":"Admin@123"}'
```

---

## Troubleshooting

### Docker Issues

**Docker not starting:**
- Windows: Make sure Docker Desktop is running (system tray icon)
- Linux: `sudo systemctl start docker`

**Port already in use:**
```bash
# Change ports in docker-compose.yml
ports:
  - "3001:80"    # Instead of 3000:80
  - "8081:8080"  # Instead of 8080:8080
```

**Database connection failed:**
```bash
# Check logs
docker-compose logs database

# Restart database
docker-compose restart database
```

### Manual Setup Issues

**PostGIS not found:**
- Install PostGIS extension (see Setup instructions above)
- Verify: `psql -U postgres -d Disaster_Management -c "SELECT PostGIS_version();"`

**Backend won't start:**
- Check Java version: `java -version` (should be 17+)
- Check PostgreSQL is running: `Get-Service postgresql-x64-18`

**Frontend won't start:**
- Install Node.js: https://nodejs.org/
- Check version: `node --version` (should be 18+)

---

## Next Steps

1. ✅ Get the app running (choose Docker or Manual above)
2. 📖 Read [README.md](README.md) for project overview
3. 🐳 Read [DOCKER.md](DOCKER.md) for advanced Docker usage
4. 🔒 Read [SECURITY.md](SECURITY.md) for security guidelines
5. 🎨 Start building features!

---

## Need Help?

- **Docker Issues:** Check [DOCKER.md](DOCKER.md) troubleshooting section
- **Backend Issues:** Check `backend/README.md`
- **Frontend Issues:** Check `frontend/README.md`
- **Database Issues:** See PostgreSQL logs or Docker logs

---

**Choose Docker for the fastest setup! 🚀**
