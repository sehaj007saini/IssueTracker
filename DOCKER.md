# Docker Deployment Guide

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+

### Install Docker

**Windows:**
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Run installer and restart
3. Verify: `docker --version` and `docker-compose --version`

**Linux:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Mac:**
```bash
brew install --cask docker
```

---

## Quick Start (Production)

### 1. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
notepad .env  # Windows
nano .env     # Linux/Mac
```

### 2. Start All Services

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/actuator/health

### 4. Stop Services

```bash
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

---

## Development Mode

Use development compose file for hot reload:

```bash
# Start in dev mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or with rebuild
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Features in Dev Mode:**
- Frontend hot reload (Vite)
- Backend auto-restart (Spring DevTools)
- Source code mounted as volumes
- Debug ports exposed

---

## Docker Services

### 1. Database (PostgreSQL + PostGIS)
- **Image:** `postgis/postgis:16-3.4`
- **Port:** 5432
- **Volume:** `postgres_data` (persistent)
- **Features:** PostGIS 3.4 enabled automatically

### 2. Backend (Spring Boot)
- **Build:** Multi-stage (Maven + JRE)
- **Port:** 8080
- **Volume:** `backend_uploads` (file storage)
- **Health Check:** `/actuator/health`

### 3. Frontend (React + Nginx)
- **Build:** Multi-stage (Node + Nginx)
- **Port:** 3000
- **Features:** Gzip, reverse proxy to backend

---

## Useful Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Containers
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Execute Commands in Container
```bash
# Access backend shell
docker-compose exec backend sh

# Access database
docker-compose exec database psql -U postgres -d Disaster_Management

# Run migrations manually
docker-compose exec backend java -jar app.jar --spring.flyway.clean-disabled=false
```

### Database Operations
```bash
# Backup database
docker-compose exec database pg_dump -U postgres Disaster_Management > backup.sql

# Restore database
docker-compose exec -T database psql -U postgres Disaster_Management < backup.sql

# Access PostgreSQL CLI
docker-compose exec database psql -U postgres -d Disaster_Management
```

---

## Environment Variables

Create `.env` file in root directory:

```env
# Required
DB_PASSWORD=your_secure_password
JWT_SECRET=your-256-bit-secret-key-change-in-production

# Optional (Twilio)
TWILIO_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

---

## Production Deployment

### Using Docker Compose (Simple)

```bash
# 1. Set production environment variables
nano .env

# 2. Start services
docker-compose up -d

# 3. Check health
curl http://localhost:8080/actuator/health
```

### Using Docker Swarm (Scalable)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml disaster-mgmt

# Scale services
docker service scale disaster-mgmt_backend=3

# View services
docker stack services disaster-mgmt
```

### Cloud Deployment

**AWS ECS:**
```bash
# Install ECS CLI
ecs-cli compose --file docker-compose.yml up
```

**Azure Container Instances:**
```bash
az container create --resource-group myResourceGroup \
  --file docker-compose.yml
```

**Google Cloud Run:**
```bash
gcloud run deploy disaster-mgmt \
  --image gcr.io/project-id/disaster-mgmt:latest
```

---

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:3000

# Database health
docker-compose exec database pg_isready -U postgres
```

### Resource Usage

```bash
# View container stats
docker stats

# View specific container
docker stats disaster-mgmt-backend
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs backend

# Check container status
docker-compose ps

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database connection failed
```bash
# Check database is running
docker-compose ps database

# Check database logs
docker-compose logs database

# Test connection
docker-compose exec backend wget -q -O- http://database:5432
```

### Port already in use
```bash
# Find process using port 8080
netstat -ano | findstr :8080    # Windows
lsof -i :8080                   # Linux/Mac

# Kill process or change port in docker-compose.yml
```

### Out of disk space
```bash
# Clean up Docker
docker system prune -a --volumes

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

---

## Updating Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or without downtime
docker-compose up -d --no-deps --build backend
```

---

## Backup and Restore

### Full Backup
```bash
# Create backup directory
mkdir -p backups

# Backup database
docker-compose exec database pg_dump -U postgres Disaster_Management > backups/db_$(date +%Y%m%d).sql

# Backup uploads
docker cp disaster-mgmt-backend:/app/uploads backups/uploads_$(date +%Y%m%d)
```

### Restore
```bash
# Restore database
docker-compose exec -T database psql -U postgres Disaster_Management < backups/db_20241012.sql

# Restore uploads
docker cp backups/uploads_20241012 disaster-mgmt-backend:/app/uploads
```

---

## Performance Tuning

### Database
```yaml
# In docker-compose.yml
environment:
  POSTGRES_SHARED_BUFFERS: 256MB
  POSTGRES_EFFECTIVE_CACHE_SIZE: 1GB
  POSTGRES_MAX_CONNECTIONS: 100
```

### Backend
```yaml
# In docker-compose.yml
environment:
  JAVA_OPTS: "-Xms512m -Xmx1024m"
  SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE: 20
```

---

## Security Best Practices

1. **Change default passwords** in `.env`
2. **Use secrets management** for production (Docker Secrets, Vault)
3. **Enable HTTPS** with reverse proxy (Nginx, Traefik)
4. **Limit exposed ports** (remove port mappings for database)
5. **Regular updates** (`docker-compose pull` and rebuild)
6. **Use non-root users** (already configured in Dockerfiles)
7. **Scan images** regularly (`docker scan`)

---

## Next Steps

- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure CDN for frontend static assets
- [ ] Set up log aggregation (ELK stack)
- [ ] Configure automated backups
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Implement CI/CD pipeline

---

**Docker deployment is now ready! 🐳**
