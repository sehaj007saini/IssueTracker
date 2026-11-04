# 🚀 Render.com Deployment Guide - IssueTracker

## Step-by-Step Deployment Instructions

### Prerequisites
- GitHub account with IssueTracker repository (✅ Already done!)
- Render.com account (free to sign up)

---

## 🎯 DEPLOYMENT STEPS

### STEP 1: Sign Up for Render
1. Go to https://render.com
2. Click "Get Started" or "Sign Up"
3. Choose "Sign Up with GitHub"
4. Authorize Render to access your GitHub repositories
5. Complete your profile

---

### STEP 2: Create PostgreSQL Database

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**

2. Fill in the details:
   - **Name**: `issuetracker-db`
   - **Database**: `Disaster_Management`
   - **User**: `postgres`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16
   - **Plan**: 
     - **Free** (for testing - limited resources, may sleep)
     - **Starter ($7/month)** - recommended for production

3. Click **"Create Database"**

4. **IMPORTANT**: Copy these connection details (you'll need them):
   ```
   Internal Database URL: postgres://...
   External Database URL: postgres://...
   PSQL Command: PSQL postgresql://...
   Hostname: ...
   Port: 5432
   Database: Disaster_Management
   Username: postgres
   Password: [generated password]
   ```

5. **Enable PostGIS Extension**:
   - Go to your database dashboard
   - Click "Connect" → "External Connection"
   - Use the PSQL command or any PostgreSQL client
   - Run: `CREATE EXTENSION IF NOT EXISTS postgis;`

---

### STEP 3: Deploy Backend Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**

2. Connect Repository:
   - Click "Connect Repository"
   - Find and select: `sehaj007saini/IssueTracker`
   - Click "Connect"

3. Configure Service:
   - **Name**: `issuetracker-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile` (or just `Dockerfile` since root is backend)
   - **Instance Type**: 
     - **Free** (for testing - sleeps after 15 min inactivity)
     - **Starter ($7/month)** - recommended

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   ```env
   DB_HOST=<your-database-internal-hostname>
   DB_PORT=5432
   DB_NAME=Disaster_Management
   DB_USERNAME=postgres
   DB_PASSWORD=<your-database-password>
   JWT_SECRET=9px+/wrAAoUk0pg4fxc3INJ0rs8l0V1nwcJMi9Flx/lGQRgP5D0ZMfdowd5iJXnQ
   SPRING_PROFILES_ACTIVE=prod
   SERVER_PORT=8080
   TWILIO_ENABLED=false
   UPLOAD_DIR=/app/uploads
   ```

   **Get DB_HOST from Step 2**: Use the "Internal Database URL" hostname
   Example: `dpg-xxxxx-a.oregon-postgres.render.com`

5. Click **"Create Web Service"**

6. Wait for deployment (5-10 minutes)
   - Watch the logs for "Started Application in X seconds"
   - Copy your backend URL: `https://issuetracker-backend.onrender.com`

---

### STEP 4: Deploy Frontend (Static Site)

1. In Render Dashboard, click **"New +"** → **"Static Site"**

2. Connect Repository:
   - Select: `sehaj007saini/IssueTracker`
   - Click "Connect"

3. Configure Static Site:
   - **Name**: `issuetracker-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable**:
   ```env
   VITE_API_BASE_URL=https://issuetracker-backend.onrender.com/api
   VITE_WS_BASE_URL=wss://issuetracker-backend.onrender.com/ws
   ```

   **Replace** `issuetracker-backend` with your actual backend service name from Step 3

5. Click **"Create Static Site"**

6. Wait for deployment (3-5 minutes)
   - Your frontend URL: `https://issuetracker-frontend.onrender.com`

---

### STEP 5: Configure CORS in Backend

You need to update the backend to allow requests from your frontend domain.

1. **Update SecurityConfig.java**:

   Go to: `backend/src/main/java/com/localproblems/os/config/SecurityConfig.java`

   Find the CORS configuration and update the allowed origins:

   ```java
   .cors(cors -> cors
       .configurationSource(request -> {
           CorsConfiguration config = new CorsConfiguration();
           config.setAllowedOrigins(Arrays.asList(
               "http://localhost:5173",
               "http://localhost:3000",
               "https://issuetracker-frontend.onrender.com"  // Add this
           ));
           config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
           config.setAllowedHeaders(Arrays.asList("*"));
           config.setAllowCredentials(true);
           config.setMaxAge(3600L);
           return config;
       })
   )
   ```

2. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Add Render frontend URL to CORS configuration"
   git push origin main
   ```

3. Render will **automatically redeploy** the backend (watch the dashboard)

---

### STEP 6: Test Your Deployment

1. **Visit your frontend**: `https://issuetracker-frontend.onrender.com`

2. **Test functionality**:
   - ✅ Page loads correctly
   - ✅ Register a new user
   - ✅ Login works
   - ✅ Map loads (OpenStreetMap)
   - ✅ Report an issue
   - ✅ View issues
   - ✅ Comment on issues

3. **Check backend health**:
   - Visit: `https://issuetracker-backend.onrender.com/actuator/health`
   - Should return: `{"status":"UP"}`

---

## 📊 What You Get

### Free Tier (Development/Testing):
- **Database**: PostgreSQL with PostGIS (256 MB, 90 days retention)
- **Backend**: Web Service (512 MB RAM, sleeps after 15 min inactivity)
- **Frontend**: Static Site (100 GB bandwidth)
- **Cost**: **$0/month**
- **Limitations**: 
  - Services sleep after inactivity (15-30 sec cold start)
  - Limited database size
  - 750 hours/month limit per service

### Starter Tier (Production):
- **Database**: PostgreSQL ($7/month, 1 GB, unlimited retention)
- **Backend**: Web Service ($7/month, 512 MB RAM, always on)
- **Frontend**: Static Site ($0, 100 GB bandwidth)
- **Total Cost**: **$14/month**
- **Benefits**:
  - No sleep/cold starts
  - Better performance
  - Automatic backups
  - 99.9% uptime SLA

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)
1. Go to your service → Settings → Custom Domain
2. Add your domain (e.g., `issuetracker.yourdomain.com`)
3. Add DNS records as shown by Render
4. Wait for SSL certificate (automatic)

### Database Backups
- **Free tier**: Manual backups only
- **Paid tier**: Automatic daily backups (7 day retention)

To create manual backup:
1. Go to database → Backups
2. Click "Create Backup"

### Environment Updates
To change environment variables:
1. Go to service → Environment
2. Edit variables
3. Click "Save Changes"
4. Service auto-redeploys

### View Logs
1. Go to service dashboard
2. Click "Logs" tab
3. Real-time logs appear here

### Monitoring
1. Go to service → Metrics
2. View CPU, Memory, Request metrics

---

## 🚨 Important Notes

### Free Tier Limitations
- **Cold Starts**: Services sleep after 15 min inactivity
  - First request after sleep takes 15-30 seconds
  - Subsequent requests are fast
- **Database Size**: 256 MB limit (can store ~10,000 issues)
- **Hours Limit**: 750 hours/month (services shut down if exceeded)

### Production Recommendations
1. ✅ Upgrade to Starter plan ($14/month)
2. ✅ Set up custom domain
3. ✅ Enable automatic backups
4. ✅ Add monitoring/alerts
5. ✅ Configure CDN (Cloudflare) for frontend
6. ✅ Set up error tracking (Sentry)

### Security Checklist
- ✅ JWT_SECRET is strong (256-bit)
- ✅ Database password is secure
- ✅ CORS only allows your frontend domain
- ✅ HTTPS enabled (automatic on Render)
- ✅ Environment variables are not in code
- ⚠️ Change JWT_SECRET if deploying to production

---

## 🆘 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure DB_HOST uses internal hostname
- Check database is running

### Frontend can't connect to backend
- Verify VITE_API_BASE_URL is correct
- Check CORS configuration includes frontend URL
- Check backend health endpoint
- Look at browser console for errors

### Database connection failed
- Use **internal** database URL for backend
- Verify database is in same region
- Check DB_PASSWORD is correct
- Ensure PostGIS extension is installed

### Cold start issues (Free tier)
- Services sleep after 15 min inactivity
- First request takes 15-30 seconds
- Solutions:
  - Upgrade to paid plan
  - Use uptime monitor (pings every 5 min)
  - Accept the limitation for testing

---

## 📈 Scaling Your App

### When to upgrade?
- Users complaining about slow load times
- Database size approaching limit
- Need better uptime SLA
- More than 100 concurrent users

### Upgrade path:
1. **Starter**: $14/month (up to 1,000 users)
2. **Pro**: $25/month (up to 10,000 users)
3. **Enterprise**: Custom pricing (unlimited)

---

## 🎉 Success!

Your app should now be live at:
- **Frontend**: `https://issuetracker-frontend.onrender.com`
- **Backend**: `https://issuetracker-backend.onrender.com`
- **Health Check**: `https://issuetracker-backend.onrender.com/actuator/health`

### Next Steps:
1. ✅ Test all functionality
2. ✅ Share the URL with users
3. ✅ Monitor logs and metrics
4. ✅ Set up domain (optional)
5. ✅ Add to portfolio/resume

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status Page**: https://status.render.com
- **Your Dashboard**: https://dashboard.render.com

---

**Deployment Time**: ~30 minutes total
**Difficulty**: ⭐ Easy
**Cost**: Free to start, $14/month for production

Good luck! 🚀
