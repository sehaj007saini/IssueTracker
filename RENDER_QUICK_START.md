# ⚡ Render.com Quick Start - 5 Steps to Deploy

## 🎯 What You Need
- ✅ GitHub repository (Done!)
- ⏰ 30 minutes of your time
- 💳 Credit card (optional - only for paid plans)

---

## 📋 Quick Steps

### 1️⃣ Sign Up (2 minutes)
1. Go to https://render.com
2. Click "Sign Up with GitHub"
3. Authorize Render

### 2️⃣ Create Database (3 minutes)
1. Click "New +" → "PostgreSQL"
2. Name: `issuetracker-db`
3. Database: `Disaster_Management`
4. Plan: Free (or Starter $7/mo)
5. Click "Create"
6. **SAVE**: Copy the connection details shown

### 3️⃣ Deploy Backend (10 minutes)
1. Click "New +" → "Web Service"
2. Connect repo: `sehaj007saini/IssueTracker`
3. Settings:
   - Name: `issuetracker-backend`
   - Root: `backend`
   - Environment: Docker
   - Plan: Free (or Starter $7/mo)
4. Add Environment Variables (from step 2):
   ```
   DB_HOST=<from-step-2>
   DB_PORT=5432
   DB_NAME=Disaster_Management
   DB_USERNAME=postgres
   DB_PASSWORD=<from-step-2>
   JWT_SECRET=9px+/wrAAoUk0pg4fxc3INJ0rs8l0V1nwcJMi9Flx/lGQRgP5D0ZMfdowd5iJXnQ
   SPRING_PROFILES_ACTIVE=prod
   SERVER_PORT=8080
   TWILIO_ENABLED=false
   ```
5. Click "Create"
6. **SAVE**: Copy your backend URL

### 4️⃣ Deploy Frontend (5 minutes)
1. Click "New +" → "Static Site"
2. Connect repo: `sehaj007saini/IssueTracker`
3. Settings:
   - Name: `issuetracker-frontend`
   - Root: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
4. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://issuetracker-backend.onrender.com/api
   VITE_WS_BASE_URL=wss://issuetracker-backend.onrender.com/ws
   ```
   (Replace with your backend URL from step 3)
5. Click "Create"

### 5️⃣ Update CORS (5 minutes)
After frontend deploys, update backend to allow frontend URL.

**I'll help you do this - just tell me your frontend URL!**

---

## ✅ Done!

Your app is live at:
- **Frontend**: `https://issuetracker-frontend.onrender.com`
- **Backend**: `https://issuetracker-backend.onrender.com`

Test it:
1. Visit frontend URL
2. Register a user
3. Report an issue
4. Done! 🎉

---

## 💰 Costs

**Free Tier**: $0/month
- Perfect for testing/portfolio
- Services sleep after 15 min (30 sec cold start)

**Production**: $14/month
- Database: $7/month
- Backend: $7/month
- Frontend: Free
- Always on, no cold starts

---

## 📖 Full Guide
See `RENDER_DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

## 🆘 Quick Help

**Backend won't start?**
- Check logs in Render dashboard
- Verify all environment variables

**Frontend can't connect?**
- Update CORS (step 5)
- Check backend URL is correct

**Database error?**
- Use internal database URL
- Check password is correct

---

**Ready to deploy? Go to https://render.com and follow the 5 steps above!** 🚀
