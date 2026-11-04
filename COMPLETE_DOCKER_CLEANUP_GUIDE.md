# Complete Docker Space Cleanup Guide

## Current C Drive Status
- **Total Docker data on C drive**: 9.42 GB
- **C Drive Free Space**: 10.15 GB

## Docker Space Breakdown

### 1. Docker Images (1.46 GB) - ACTIVE, DON'T DELETE
These are your running container images:
- `disastermanagement-backend`: 514 MB
- `disastermanagement-frontend`: 103 MB  
- `postgis/postgis:16-3.4`: 853 MB

**Status**: ✅ Needed for application to run

### 2. Docker WSL VHDX Files (4.6 GB) - CAN BE MOVED
Location: `C:\Users\SEHAJ\AppData\Local\Docker\wsl\`
- `docker_data.vhdx`: 4.51 GB (main Docker data)
- `ext4.vhdx`: 0.09 GB (Docker Desktop data)

**Action**: Move to E drive via Docker Desktop settings

### 3. Other Docker Files (3.36 GB) - CAN BE CLEANED/REDUCED

Likely includes:
- Docker logs
- Temporary files
- Docker Desktop cache
- Old build artifacts

## Steps to Free Maximum Space

### Option 1: Move Entire Docker Desktop to E Drive (RECOMMENDED - Frees all 9.42 GB)

1. **Stop Docker Desktop completely**
   ```powershell
   # Close Docker Desktop from system tray
   # OR run:
   wsl --shutdown
   ```

2. **Open Docker Desktop**
   - Go to Settings (⚙️)
   - Navigate to: Resources → Advanced OR Resources → WSL Integration
   - Look for "Disk image location" setting
   - Click Browse and select: `E:\Docker`
   - Click "Apply & Restart"

3. **Verify the move worked**
   ```powershell
   # Check C drive space increased
   Get-PSDrive C | Select-Object @{Name="FreeGB";Expression={[math]::Round($_.Free/1GB,2)}}
   
   # Docker should now be on E drive
   ```

**Expected Result**: ~9 GB freed on C drive

### Option 2: Compact Docker VHDX Files (Reduces size without moving)

Docker VHDX files can grow but don't shrink automatically. Compact them:

1. **Stop Docker Desktop**
   ```powershell
   wsl --shutdown
   ```

2. **Compact the VHDX files**
   ```powershell
   # Run in PowerShell as Administrator
   Optimize-VHD -Path "C:\Users\SEHAJ\AppData\Local\Docker\wsl\disk\docker_data.vhdx" -Mode Full
   ```

3. **Restart Docker Desktop**

**Expected Result**: Could reduce VHDX from 4.6 GB to 2-3 GB

### Option 3: Clean Docker Logs and Temp Files

```powershell
# Clean Docker logs
docker system prune -a --volumes -f

# Remove unused images (careful - will remove ALL images not in use)
docker image prune -a -f

# Clear Docker Desktop logs
Remove-Item "C:\Users\SEHAJ\AppData\Local\Docker\log\*" -Recurse -Force -ErrorAction SilentlyContinue
```

**Expected Result**: ~1-2 GB freed

### Option 4: Limit Docker Log Sizes (Prevents future growth)

Add to your `docker-compose.yml`:

```yaml
services:
  database:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  frontend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

This limits each container's logs to 30 MB max (10 MB × 3 files).

## Additional Space Saving (Non-Docker)

### Clear Browser Cache (5 GB)
1. Chrome: Settings → Privacy and security → Clear browsing data
2. Select "Cached images and files" → All time → Clear data

### Clear Windows Temp Files
```powershell
# Run as Administrator
cleanmgr /sageset:1
cleanmgr /sagerun:1
```

### Clear Windows Update Cache (5-10 GB)
```powershell
# Run as Administrator
Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase
```

## Summary of What We Already Did

✅ **Completed (freed 4.2 GB)**:
1. Moved project Docker volumes to E drive
2. Moved Maven repository to E drive (0.77 GB)
3. Cleaned Docker build cache twice (4.2 GB total)
4. Cleaned npm cache
5. Removed old Docker named volumes

## Expected Total Savings

If you do **Option 1 (Move Docker to E drive)** + Clear Browser Cache:
- Docker WSL data: **9.42 GB freed**
- Browser cache: **~5 GB freed**
- **Total**: ~14 GB freed
- **Final C drive free space**: ~24 GB (from current 10.15 GB)

## Verification Commands

After cleanup, verify your space savings:

```powershell
# Check C drive space
Get-PSDrive C | Select-Object @{Name="FreeGB";Expression={[math]::Round($_.Free/1GB,2)}}

# Check Docker space usage
docker system df

# Check Docker location
docker info | Select-String "Docker Root Dir"

# Verify application still works
docker ps
```

## Important Notes

- **Don't delete Docker images** (1.46 GB) - your application needs them
- **Always backup data** before major moves
- **Your application will keep running** on E drive after the move
- **Database data is safe** - already on E drive in `docker-volumes/postgres`
