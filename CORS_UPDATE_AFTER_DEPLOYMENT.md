# 🔧 CORS Update - After Deployment

## When to Apply This
After you deploy the frontend to Render and get your frontend URL, you need to update the backend to allow requests from that URL.

---

## Your Frontend URL Will Be
Something like: `https://issuetracker-frontend.onrender.com`

(The exact name depends on what you named your frontend service)

---

## What to Do

### Option 1: I'll Do It For You (Easiest)
Just tell me:
> "My frontend URL is https://issuetracker-frontend.onrender.com"

And I'll update the code and push it for you!

### Option 2: Manual Update

1. **Edit SecurityConfig.java**:
   File: `backend/src/main/java/com/localproblems/os/config/SecurityConfig.java`

2. **Find this line** (around line 66):
   ```java
   configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
   ```

3. **Replace with**:
   ```java
   configuration.setAllowedOrigins(List.of(
       "http://localhost:5173", 
       "http://localhost:3000",
       "https://issuetracker-frontend.onrender.com"  // Add your frontend URL
   ));
   ```

4. **Commit and Push**:
   ```bash
   git add backend/src/main/java/com/localproblems/os/config/SecurityConfig.java
   git commit -m "Add Render frontend URL to CORS configuration"
   git push origin main
   ```

5. **Wait for Auto-Deploy**:
   Render will automatically detect the push and redeploy your backend (takes 5-10 minutes).

---

## How to Know It Worked

1. Visit your frontend URL
2. Try to register or login
3. If it works = CORS is configured correctly ✅
4. If you see CORS errors in browser console = Need to update ❌

---

## Browser Console Error Example

If CORS is NOT configured, you'll see:
```
Access to XMLHttpRequest at 'https://issuetracker-backend.onrender.com/api/auth/login' 
from origin 'https://issuetracker-frontend.onrender.com' has been blocked by CORS policy
```

After updating CORS, this error will disappear.

---

## Just Tell Me Your Frontend URL!

After you deploy the frontend, just send me a message like:

> "frontend is at https://issuetracker-frontend.onrender.com"

And I'll update the code and push it immediately! 🚀
