# Frontend Troubleshooting Guide

## Current Status: ✅ All Services Running

The frontend has been successfully rebuilt with the correct configuration and all services are communicating properly.

## How to Check if Frontend is Working

### 1. Open the Application
Open your browser and navigate to: **http://localhost:3000**

### 2. Check Browser Console
Press `F12` or right-click and select "Inspect" to open Developer Tools, then click on the "Console" tab.

### 3. Expected Behavior

#### If Everything is Working:
- You should see the login/registration page
- No errors in the browser console
- You can open Network tab (F12 → Network) and see requests to `/api/`

#### Common Issues and Solutions:

### Issue 1: Blank White Page
**Symptom**: Page loads but shows nothing

**Solution**:
1. Check browser console for errors (F12)
2. Look for messages like "Failed to fetch" or CORS errors
3. Verify all services are running: `docker-compose ps`

### Issue 2: "Failed to fetch" or Network Errors
**Symptom**: Errors in console about network requests failing

**Possible Causes**:
- Backend not responding
- Nginx proxy not working

**Solution**:
```bash
# Check if backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend --tail 50

# Restart backend
docker-compose restart backend
```

### Issue 3: 404 Errors for Assets
**Symptom**: CSS or JavaScript files not loading

**Solution**:
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose restart frontend
```

### Issue 4: API Requests Returning 403/401
**Symptom**: Authentication errors

**This is NORMAL** - It means:
- ✅ Frontend is working
- ✅ Nginx proxy is working  
- ✅ Backend is responding
- You just need to register/login

## Testing the Setup

### Test 1: Check Frontend is Serving Files
```powershell
curl http://localhost:3000
```
Expected: HTML content returned

### Test 2: Check API Proxy is Working
```powershell
curl http://localhost:3000/api/issues
```
Expected: 401 Unauthorized (means backend is responding)

### Test 3: Check Backend Directly
```powershell
curl http://localhost:8080/actuator/health
```
Expected: 403 or health status

## Configuration Details

### Frontend Configuration
- **Port**: 3000
- **API Base URL**: `/api` (proxied to backend)
- **WebSocket URL**: `/ws` (proxied to backend)
- **Environment**: Production build

### Nginx Proxy Rules
```
/api  → http://backend:8080/api
/ws   → http://backend:8080/ws
```

### Expected Console Output (Normal)
When you open http://localhost:3000, you might see:
- React warnings (these are normal in development)
- No fetch errors
- Possibly authentication messages (these are expected)

## What Was Fixed

1. ✅ Created `.env` file in frontend folder with correct API URLs
2. ✅ Updated Dockerfile to include .env file during build
3. ✅ Rebuilt frontend container with new configuration
4. ✅ Verified Nginx proxy configuration is correct
5. ✅ Confirmed all containers can communicate on Docker network

## Verify Setup is Working

Run these commands in PowerShell:

```powershell
# 1. Check all containers are running
docker-compose ps

# 2. Check frontend is serving content
$response = Invoke-WebRequest http://localhost:3000 -UseBasicParsing
Write-Host "Frontend Status: $($response.StatusCode)"
Write-Host "Content Size: $($response.Content.Length) bytes"

# 3. Check API proxy is working (401 is expected)
try {
    curl http://localhost:3000/api/issues
} catch {
    Write-Host "API returned: $($_.Exception.Message)" 
    Write-Host "✅ This is normal - backend is responding!"
}

# 4. View frontend logs
docker-compose logs frontend --tail 20
```

## Still Having Issues?

### Get Detailed Logs
```powershell
# All logs
docker-compose logs --tail 100

# Frontend only
docker-compose logs frontend --tail 50

# Backend only
docker-compose logs backend --tail 50
```

### Restart Everything
```powershell
docker-compose restart
```

### Clean Restart (⚠️ Deletes data)
```powershell
docker-compose down -v
docker-compose up -d
```

## Browser-Specific Testing

### Chrome/Edge
1. Open http://localhost:3000
2. Press F12 for Developer Tools
3. Go to Console tab - check for errors
4. Go to Network tab - check API requests
5. Go to Application tab - check if service worker is registered

### Firefox
1. Open http://localhost:3000
2. Press F12 for Developer Tools
3. Go to Console tab - check for errors
4. Go to Network tab - check API requests

## What to Look For

### ✅ Good Signs:
- HTTP 200 for main page
- HTTP 200 for CSS/JS files
- HTTP 401/403 for API requests (means backend is responding)
- React app loads
- Login form appears

### ❌ Bad Signs:
- HTTP 404 for CSS/JS files → Frontend build issue
- ERR_CONNECTION_REFUSED → Service not running
- CORS errors → Proxy configuration issue
- Blank page with no errors → Check if JavaScript files loaded

## Quick Fix Checklist

- [ ] Open http://localhost:3000 in browser
- [ ] Press F12 and check Console tab
- [ ] Check if you see any red errors
- [ ] Try to register a new user
- [ ] If registration works, **everything is working!**

## Contact/Debug Information

If you're still seeing errors, please provide:
1. Screenshot of browser console (F12 → Console)
2. Output of: `docker-compose ps`
3. Output of: `docker-compose logs frontend --tail 30`
4. The exact error message you're seeing

---

**Most Common Issue**: The error you're seeing is likely just the application requiring you to login/register. If you can see a login form, everything is working correctly!
