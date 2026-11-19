# 🚀 Deployment Guide

Complete guide for deploying the IssueTracker application to production environments.

## Table of Contents
1. [Deployment Options](#deployment-options)
2. [Prerequisites](#prerequisites)
3. [AWS Deployment (Recommended)](#aws-deployment-recommended)
4. [Azure Deployment](#azure-deployment)
5. [Google Cloud Platform](#google-cloud-platform)
6. [DigitalOcean Deployment](#digitalocean-deployment)
7. [VPS Deployment (Generic)](#vps-deployment-generic)
8. [Local Production Build](#local-production-build)
9. [Environment Configuration](#environment-configuration)
10. [Post-Deployment Checklist](#post-deployment-checklist)
11. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Deployment Options

| Option | Difficulty | Cost | Best For |
|--------|-----------|------|----------|
| AWS (EC2 + RDS) | Medium | $30-100/mo | Production, Scalability |
| DigitalOcean Droplet | Easy | $20-50/mo | Small-Medium projects |
| Azure App Service | Medium | $40-120/mo | Enterprise, Microsoft stack |
| GCP (Compute Engine) | Medium | $35-100/mo | Google ecosystem |
| VPS (Linode/Vultr) | Easy | $15-40/mo | Budget-friendly |
| Docker on VPS | Easy | $10-30/mo | Full control |

---

## Prerequisites

### Required Tools
- Git installed
- Docker & Docker Compose (for containerized deployment)
- SSH client
- Domain name (optional but recommended)

### Required Accounts
- Cloud provider account (AWS/Azure/GCP/DigitalOcean)
- Domain registrar (Namecheap, GoDaddy, etc.)
- Twilio account (for SMS/WhatsApp notifications)

---

## AWS Deployment (Recommended)

### Option A: EC2 with Docker (Easiest)

#### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance

2. **Configure Instance**
   - **Name**: `issuetracker-production`
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: `t3.medium` (2 vCPU, 4GB RAM) minimum
   - **Key Pair**: Create new or select existing
   - **Storage**: 30 GB gp3

3. **Security Group Rules**
   ```
   SSH       TCP  22    Your IP
   HTTP      TCP  80    0.0.0.0/0
   HTTPS     TCP  443   0.0.0.0/0
   Custom    TCP  8080  0.0.0.0/0 (Backend API)
   Custom    TCP  5432  Security Group only (PostgreSQL)
   ```

4. **Launch Instance** and note the public IP

#### Step 2: Connect to EC2

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Update system
sudo apt update && sudo apt upgrade -y
```

#### Step 3: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

#### Step 4: Clone and Configure Application

```bash
# Clone repository
git clone https://github.com/sehaj007saini/IssueTracker.git
cd IssueTracker

# Create production environment file
nano .env
```

**Production .env file:**
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=disaster_management
DB_USER=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# Backend
JWT_SECRET=YOUR_VERY_LONG_RANDOM_SECRET_KEY_HERE_MIN_64_CHARS
JWT_EXPIRATION=86400000
SPRING_PROFILES_ACTIVE=prod

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Frontend
VITE_API_BASE_URL=http://YOUR_EC2_PUBLIC_IP:8080/api
VITE_WS_URL=ws://YOUR_EC2_PUBLIC_IP:8080/ws

# File Storage
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ALLOWED_ORIGINS=http://YOUR_EC2_PUBLIC_IP:3000,http://YOUR_DOMAIN.com
```

#### Step 5: Update docker-compose for Production

```bash
nano docker-compose.yml
```

Add restart policies and resource limits:
```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:16-3.4
    container_name: disaster_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./docker-volumes/postgres:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  backend:
    build: ./backend
    container_name: disaster_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: ${JWT_EXPIRATION}
      TWILIO_ACCOUNT_SID: ${TWILIO_ACCOUNT_SID}
      TWILIO_AUTH_TOKEN: ${TWILIO_AUTH_TOKEN}
      TWILIO_PHONE_NUMBER: ${TWILIO_PHONE_NUMBER}
      TWILIO_WHATSAPP_NUMBER: ${TWILIO_WHATSAPP_NUMBER}
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}
    volumes:
      - ./docker-volumes/uploads:/app/uploads
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL}
        VITE_WS_URL: ${VITE_WS_URL}
    container_name: disaster_frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "3000:80"
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

volumes:
  postgres_data:
  uploads:
```

#### Step 6: Start Application

```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Wait for services to be healthy (2-3 minutes)
docker-compose logs backend | grep "Started LocalProblemsOsApplication"
```

#### Step 7: Verify Deployment

```bash
# Test backend
curl http://localhost:8080/actuator/health

# Test frontend
curl http://localhost:3000

# Check database connection
docker exec -it disaster_postgres psql -U postgres -d disaster_management -c "\dt"
```

Access your application:
- Frontend: `http://YOUR_EC2_PUBLIC_IP:3000`
- Backend API: `http://YOUR_EC2_PUBLIC_IP:8080/api`

#### Step 8: Setup Nginx (Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/issuetracker
```

**Nginx Configuration:**
```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/issuetracker /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 9: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

#### Step 10: Setup Firewall

```bash
# Install UFW
sudo apt install ufw -y

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

### Option B: AWS Elastic Beanstalk (Managed)

#### Prerequisites
```bash
# Install EB CLI
pip install awsebcli --upgrade --user
```

#### Deploy Backend

```bash
cd backend

# Initialize EB application
eb init -p docker issuetracker-backend --region us-east-1

# Create environment
eb create production-backend --instance-type t3.medium

# Configure environment variables
eb setenv DB_HOST=your-rds-endpoint DB_PASSWORD=your-password JWT_SECRET=your-secret

# Deploy
eb deploy

# Check status
eb status
eb open
```

#### Deploy Frontend

```bash
cd frontend

# Build production
npm run build

# Create S3 bucket for static hosting
aws s3 mb s3://issuetracker-frontend --region us-east-1

# Upload build
aws s3 sync dist/ s3://issuetracker-frontend --acl public-read

# Enable static website hosting
aws s3 website s3://issuetracker-frontend --index-document index.html --error-document index.html
```

---

### Option C: AWS ECS (Container Service)

See AWS ECS documentation for advanced container orchestration setup.

---

## DigitalOcean Deployment

### Step 1: Create Droplet

1. Go to DigitalOcean Console
2. Create Droplet
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($24/mo - 2GB RAM, 2 vCPU)
   - **Datacenter**: Choose closest to users
   - **Add SSH Key**

### Step 2: Follow Same Steps as AWS EC2

Follow steps 2-10 from AWS EC2 deployment above. The process is identical.

### Step 3: Point Domain to Droplet

1. Go to your domain registrar
2. Add A records:
   ```
   @ → YOUR_DROPLET_IP
   www → YOUR_DROPLET_IP
   api → YOUR_DROPLET_IP
   ```

---

## VPS Deployment (Generic)

Works with Linode, Vultr, Hetzner, or any VPS provider.

### Requirements
- Ubuntu 22.04 or newer
- 2GB RAM minimum (4GB recommended)
- 20GB storage minimum
- Public IP address

### Deployment Steps
Follow AWS EC2 deployment steps 2-10. The process is identical for any VPS with root/sudo access.

---

## Local Production Build

### Build for Production

```bash
# Backend
cd backend
./mvnw clean package -DskipTests
# JAR file: target/disaster-management-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm run build
# Build files: dist/

# Run backend
java -jar target/disaster-management-0.0.1-SNAPSHOT.jar

# Serve frontend (with serve)
npm install -g serve
serve -s dist -p 3000
```

---

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# Database (Use managed database in production)
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_NAME=disaster_management
DB_USER=postgres
DB_PASSWORD=very-secure-password-min-16-chars

# JWT (Generate with: openssl rand -base64 64)
JWT_SECRET=your-very-long-random-secret-key-here-minimum-64-characters
JWT_EXPIRATION=86400000

# Application
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Frontend
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/app/uploads

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_LOCALPROBLEMS=DEBUG
```

### Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 64

# Generate database password
openssl rand -base64 32

# Generate random string
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
```

---

## Post-Deployment Checklist

### Security

- [ ] Change all default passwords
- [ ] Setup firewall (UFW/Security Groups)
- [ ] Enable SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Setup rate limiting
- [ ] Enable database backups
- [ ] Setup monitoring and alerts
- [ ] Review security group rules
- [ ] Disable unnecessary ports
- [ ] Setup fail2ban for SSH protection

### Performance

- [ ] Enable database connection pooling
- [ ] Configure caching (Redis/Caffeine)
- [ ] Setup CDN for static assets
- [ ] Optimize images and assets
- [ ] Enable gzip compression in Nginx
- [ ] Configure database indexes
- [ ] Setup database query optimization

### Monitoring

- [ ] Setup application logging
- [ ] Configure error tracking (Sentry)
- [ ] Setup uptime monitoring
- [ ] Configure performance monitoring
- [ ] Setup database monitoring
- [ ] Create backup strategy
- [ ] Test disaster recovery plan

### Testing

- [ ] Test all API endpoints
- [ ] Test user registration/login
- [ ] Test issue creation with photos
- [ ] Test fraud detection system
- [ ] Test notifications (SMS/WhatsApp)
- [ ] Test WebSocket connections
- [ ] Load test the application
- [ ] Test backup restoration

---

## Monitoring & Maintenance

### Setup Automated Backups

```bash
# Database backup script
nano /home/ubuntu/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Backup database
docker exec disaster_postgres pg_dump -U postgres disaster_management | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /home/ubuntu/backup-db.sh

# Setup cron job (daily at 2 AM)
crontab -e
```

Add line:
```
0 2 * * * /home/ubuntu/backup-db.sh >> /var/log/db-backup.log 2>&1
```

### Monitor Application

```bash
# View logs
docker-compose logs -f --tail=100

# Check resource usage
docker stats

# Check disk space
df -h

# Monitor specific service
docker-compose logs -f backend
```

### Update Application

```bash
cd IssueTracker

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Clean old images
docker system prune -a
```

---

## Troubleshooting

### Common Issues

**Issue: Backend won't start**
```bash
# Check logs
docker-compose logs backend

# Common causes:
# - Database not ready (wait 30 seconds)
# - Wrong DB credentials
# - Port 8080 already in use
```

**Issue: Frontend can't connect to backend**
```bash
# Check VITE_API_BASE_URL in .env
# Verify CORS settings in backend
# Check network security groups
```

**Issue: Out of memory**
```bash
# Check memory usage
free -h

# Restart services
docker-compose restart

# Consider upgrading instance size
```

**Issue: Database connection failed**
```bash
# Test database connection
docker exec -it disaster_postgres psql -U postgres

# Check database logs
docker-compose logs postgres
```

---

## Cost Optimization

### AWS Cost Estimates (Monthly)

- **Minimal** (~$30/mo)
  - EC2 t3.small: $15
  - RDS db.t3.micro: $15
  - Data transfer: Free tier

- **Recommended** (~$60/mo)
  - EC2 t3.medium: $30
  - RDS db.t3.small: $25
  - Load Balancer: $15

- **Production** (~$150/mo)
  - EC2 t3.large: $60
  - RDS db.t3.medium: $60
  - Load Balancer: $15
  - CloudFront CDN: $10
  - Backups: $5

### DigitalOcean Cost Estimates

- **Basic**: $24/mo (2GB RAM, 2 vCPU)
- **Standard**: $48/mo (4GB RAM, 2 vCPU)
- **Professional**: $96/mo (8GB RAM, 4 vCPU)

---

## Support

For deployment issues:
1. Check application logs
2. Review this guide
3. Check GitHub Issues
4. Contact system administrator

---

**Last Updated:** November 19, 2026  
**Version:** 1.0.0  
**Maintained By:** IssueTracker Development Team
