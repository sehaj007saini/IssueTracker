# CRITICAL: Fix Docker Desktop Corrupted State

## Current Problem
- **C Drive**: 8.68 GB free (critically low!)
- **Docker using**: ~9.4 GB with corrupted symbolic links
- Infinite loop of `wsl\wsl\wsl...` folders
- Docker Desktop cannot start

## What Happened
During our attempt to move Docker data, corrupted symbolic links were created that now form an infinite loop, preventing both deletion and Docker startup.

## SOLUTION: Factory Reset Docker Desktop

### Option 1: Using Docker Desktop UI (RECOMMENDED - SAFEST)
1. **Open Docker Desktop** (even if showing errors)
2. Click the **gear icon** (⚙️) → Settings
3. Go to **Troubleshoot** tab
4. Click **"Reset to factory defaults"** or **"Clean / Purge data"**
5. Confirm the reset
6. Wait for Docker to reinitialize (5-10 minutes)

### Option 2: Manual Cleanup (IF UI DOESN'T WORK)

**BACKUP YOUR DATA FIRST:**
Your project data is SAFE in: `E:\Projects\Disaster Management\docker-volumes\`

**Steps:**
```powershell
# 1. Completely uninstall Docker Desktop
winget uninstall Docker.DockerDesktop
# OR use "Add/Remove Programs" in Windows Settings

# 2. Manually delete Docker folders (needs admin PowerShell)
Remove-Item "C:\Users\SEHAJ\AppData\Local\Docker" -Recurse -Force
Remove-Item "C:\Users\SEHAJ\AppData\Roaming\Docker" -Recurse -Force  
Remove-Item "C:\Users\SEHAJ\.docker" -Recurse -Force
Remove-Item "C:\ProgramData\Docker" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Remove WSL distributions
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data

# 4. Reinstall Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# 5. After reinstall, your project will work automatically
# Your data is preserved in E:\Projects\Disaster Management\docker-volumes
```

## After Docker is Reset

1. **Navigate to your project:**
   ```powershell
   cd "E:\Projects\Disaster Management"
   ```

2. **Start your containers:**
   ```powershell
   docker-compose up -d
   ```

3. **Your data will be intact** because it's in `docker-volumes/` folder, not in Docker's internal storage!

## Space Saved
After reset, Docker Desktop will use ~1-2 GB initially instead of 9.4 GB.

## What We Successfully Moved
✅ **Project volumes**: `E:\Projects\Disaster Management\docker-volumes\`
   - Postgres database data
   - Uploaded files

✅ **Maven repository**: `E:\Maven\.m2\`

These are SAFE and will work immediately after Docker reset!

## Prevention
After reset, DO NOT attempt to move Docker Desktop's internal WSL data. 
The project volumes are already on E drive, which is what matters most.
