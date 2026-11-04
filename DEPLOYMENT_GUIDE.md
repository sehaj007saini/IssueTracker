# 🚀 Deployment Guide - IssueTracker

Complete guide to deploy your Disaster Management System to production.

---

## 🎯 Deployment Options

### Quick Comparison

| Platform | Difficulty | Cost | Best For |
|----------|-----------|------|----------|
| **Render** | ⭐ Easy | Free tier | Quick demo/testing |
| **Railway** | ⭐ Easy | Free tier | Quick deployment |
| **AWS (ECS)** | ⭐⭐⭐ Medium | Pay-as-go | Production ready |
| **DigitalOcean** | ⭐⭐ Easy | $12/month | Small business |
| **Heroku** | ⭐⭐ Easy | $5-25/month | Simple deployment |
| **VPS (DigitalOcean/Linode)** | ⭐⭐⭐ Medium | $6-12/month | Full control |

---

## 🌟 OPTION 1: Render.com (RECOMMENDED FOR BEGINNERS)

### ✅ Pros:
- Free tier available
- Easy deployment
- Automatic HTTPS
- Database included
- Docker support

### 📋 Steps:

#### 1. Prepare Your Repository
```bash
# Make sure everything is pushed to GitHub
git push origin main
```

#### 2. Sign Up & Connect GitHub
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repository

#### 3. Deploy Database
1. Click "New +" → "PostgreSQL"
2. Name: `issuetracker-db`
3. Database: `Disaster_Management`
4. User: `postgres`
5. Plan: **Free** (for testing) or **Starter** ($7/month)
6. Click "Create Database"
7. **Save the connection details** shown

#### 4. Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your `IssueTracker` repository
3. Settings:
   - **Name**: `issuetracker-backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Instance Type**: Free (or Starter $7/month)

4. Add Environment Variables:
   ```env
   DB_HOST=<database-internal-url-from-step-3>
   DB_PORT=5432
   DB_NAME=Disaster_Management
   DB_USERNAME=postgres
   DB_PASSWORD=<password-from-step-3>
   JWT_SECRET=<generate-256-bit-secret>
   SPRING_PROFILES_ACTIVE=prod
   SERVER_PORT=8080
   TWILIO_ENABLED=false
   ```

5. Click "Create Web Service"

#### 5. Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect your repository
3. Settings:
   - **Name**: `issuetracker-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variables:
   ```env
   VITE_API_URL=<backend-url-from-step-4>
   ```

5. Click "Create Static Site"

#### 6. Configure CORS
Update `backend/src/main/java/.../config/SecurityConfig.java`:
```java
.cors(cors -> cors
    .configurationSource(request -> {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
            "https://your-frontend.onrender.com"
        ));
        // ... rest of config
    })
)
```

Push changes and Render will auto-deploy!

### 📊 Render Costs:
- **Free Tier**: Database + Backend + Frontend = $0 (limited resources, sleeps after inactivity)
- **Production**: Database ($7) + Backend ($7) + Frontend ($0) = **$14/month**

---

## 🌟 OPTION 2: Railway.app (EASIEST)

### ✅ Pros:
- Extremely simple
- One-click PostgreSQL
- Automatic HTTPS
- $5 free credit

### 📋 Steps:

1. **Sign Up**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. Select your `IssueTracker` repository
4. **Add PostgreSQL**: Click "New" → "Database" → "PostgreSQL"
5. **Configure Services**:
   - Backend uses `backend/Dockerfile`
   - Frontend uses `frontend/Dockerfile`
6. **Set Environment Variables** (Railway auto-detects most)
7. **Deploy**!

### 📊 Railway Costs:
- Free: $5 credit/month (runs out fast)
- Paid: ~$15-20/month

---

## 🌟 OPTION 3: AWS (Production-Grade)

### ✅ Pros:
- Scalable
- Professional
- Reliable
- Full control

### 📋 High-Level Steps:

#### 1. Setup AWS Account
- Create account at https://aws.amazon.com
- Set up billing alerts

#### 2. Create RDS PostgreSQL Database
```
Service: RDS
Engine: PostgreSQL 16
Template: Free tier (for testing) or Production
Instance: db.t3.micro
Storage: 20 GB
Enable: Public access (for now)
Enable: PostGIS extension
```

#### 3. Push Docker Images to ECR
```bash
# Authenticate
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Create repositories
aws ecr create-repository --repository-name issuetracker-backend
aws ecr create-repository --repository-name issuetracker-frontend

# Tag and push
docker tag disastermanagement-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/issuetracker-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/issuetracker-backend:latest

docker tag disastermanagement-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/issuetracker-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/issuetracker-frontend:latest
```

#### 4. Deploy to ECS (Elastic Container Service)
1. Create ECS Cluster
2. Create Task Definitions for backend and frontend
3. Create Services
4. Configure Load Balancer
5. Set up Route 53 for domain

### 📊 AWS Costs:
- **Minimal**: RDS ($15) + ECS Fargate ($30) = **$45/month**
- **Production**: RDS ($50) + ECS ($100) + Load Balancer ($18) = **$168/month**

---

## 🌟 OPTION 4: DigitalOcean App Platform

### ✅ Pros:
- Balanced: easy + powerful
- Good documentation
- Reasonable pricing

### 📋 Steps:

1. **Sign Up**: https://cloud.digitalocean.com
2. **Create App** → "GitHub" → Select repository
3. **Configure Components**:
   - Backend: Docker (Dockerfile at `backend/Dockerfile`)
   - Frontend: Static Site (build: `npm run build`, output: `dist`)
   - Database: PostgreSQL 16 with PostGIS
4. **Add Environment Variables**
5. **Deploy**!

### 📊 DigitalOcean Costs:
- **Basic**: Database ($15) + Backend ($12) + Frontend ($0) = **$27/month**
- **Professional**: Database ($30) + Backend ($24) = **$54/month**

---

## 🌟 OPTION 5: VPS (Manual Deployment)

### ✅ Pros:
- Full control
- Cheapest for production
- Learn DevOps

### 📋 Steps:

#### 1. Get a VPS
- **DigitalOcean Droplet**: $6-12/month
- **Linode**: $5-10/month
- **Vultr**: $6-12/month

Choose: Ubuntu 22.04 LTS, 2GB RAM minimum

#### 2. Setup Server
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Install Nginx
apt install nginx -y

# Install Certbot (for HTTPS)
apt install certbot python3-certbot-nginx -y
```

#### 3. Clone and Deploy
```bash
# Clone your repo
git clone https://github.com/sehaj007saini/IssueTracker.git
cd IssueTracker

# Create .env file
nano .env
# Add your production environment variables

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

#### 4. Configure Nginx
```bash
nano /etc/nginx/sites-available/issuetracker
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/issuetracker /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Setup HTTPS
certbot --nginx -d your-domain.com
```

#### 5. Setup Firewall
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### 📊 VPS Costs:
- **Small**: $6-12/month (1-2GB RAM)
- **Medium**: $18-24/month (4GB RAM)
- **Large**: $48+/month (8GB+ RAM)

---

## 🔒 Pre-Deployment Checklist

### Security
- [ ] Change default passwords in `.env`
- [ ] Generate secure JWT_SECRET (256-bit minimum)
- [ ] Set up CORS for your domain only
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Review and remove debug logs
- [ ] Set `spring.jpa.show-sql=false`

### Environment Variables
```env
# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=Disaster_Management
DB_USERNAME=postgres
DB_PASSWORD=<secure-password>

# Application
JWT_SECRET=<256-bit-random-secret>
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
UPLOAD_DIR=/app/uploads

# Optional: Twilio
TWILIO_ENABLED=true
TWILIO_ACCOUNT_SID=<your-sid>
TWILIO_AUTH_TOKEN=<your-token>
TWILIO_PHONE_NUMBER=<your-number>
TWILIO_WHATSAPP_NUMBER=<your-whatsapp-number>

# Frontend
VITE_API_URL=https://api.your-domain.com
```

### Configuration Changes for Production

#### backend/src/main/resources/application.yml
```yaml
spring:
  profiles:
    active: prod
  
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:Disaster_Management}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD}
  
  jpa:
    show-sql: false  # Disable SQL logging in production
    hibernate:
      ddl-auto: validate  # Never use 'create' or 'update' in production
  
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 20MB

server:
  port: ${SERVER_PORT:8080}
  compression:
    enabled: true
  
logging:
  level:
    root: INFO
    com.localproblems: INFO
```

---

## 📊 Deployment Comparison Table

| Feature | Render | Railway | AWS | DigitalOcean | VPS |
|---------|--------|---------|-----|--------------|-----|
| **Setup Time** | 30 min | 15 min | 2-4 hours | 1 hour | 2-3 hours |
| **Difficulty** | Easy | Easiest | Hard | Medium | Medium |
| **Monthly Cost** | $14-21 | $15-25 | $45-200 | $27-54 | $6-24 |
| **Scalability** | Good | Good | Excellent | Good | Manual |
| **Free Tier** | Yes | $5 credit | Yes* | No | No |
| **Auto-scaling** | Yes | Yes | Yes | Yes | No |
| **Learning Curve** | Low | Very Low | High | Medium | High |

*AWS Free tier is limited and complex

---

## 🎯 My Recommendation

### For Learning/Portfolio:
**Use Render or Railway** - Quick, easy, has free tier

### For Small Production:
**Use DigitalOcean App Platform** - Good balance of ease and features

### For Serious Production:
**Use AWS** - Industry standard, scalable, reliable

### For Budget:
**Use VPS (DigitalOcean Droplet)** - $12/month for everything

---

## 📝 After Deployment

### Test Your Deployment
1. Visit your frontend URL
2. Register a new user
3. Report a test issue
4. Check if map loads
5. Test notifications
6. Verify backend API: `https://api.your-domain.com/actuator/health`

### Monitor
- Set up logging (Loggly, Papertrail, or CloudWatch)
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error tracking (Sentry)
- Set up database backups (daily recommended)

### Performance
- Add CDN for frontend (Cloudflare)
- Optimize images
- Enable database connection pooling
- Add Redis caching layer (optional)

---

## 🆘 Need Help?

### Documentation
- Render: https://render.com/docs
- Railway: https://docs.railway.app
- AWS: https://docs.aws.amazon.com
- DigitalOcean: https://docs.digitalocean.com

### Community
- Your GitHub Issues
- Stack Overflow
- Reddit: r/webdev, r/docker

---

## 📞 Quick Start (Render - Easiest)

1. Push code to GitHub ✅ (Already done!)
2. Sign up at https://render.com
3. Create PostgreSQL database
4. Create Web Service (backend)
5. Create Static Site (frontend)
6. Add environment variables
7. Deploy! 🚀

**Your app will be live in ~30 minutes!**

---

**Good luck with your deployment!** 🎉

Choose the option that fits your needs and budget. Start with Render or Railway for simplicity, then move to AWS or VPS as you grow.
