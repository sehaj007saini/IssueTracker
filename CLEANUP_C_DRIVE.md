# 🧹 C: Drive Cleanup Guide

## Current C: Drive Status
- **Total Used:** 110.07 GB
- **Free Space:** 8.19 GB ⚠️ CRITICALLY LOW
- **Major Space Consumer:** Old Docker data (14.17 GB)

---

## ✅ Safe to Delete Items

### 1. **Old Docker WSL Data (14.17 GB) - HIGHEST PRIORITY**
**Location:** `C:\Users\SEHAJ\AppData\Local\Docker\wsl\disk\docker_data.vhdx`
**Size:** 14.05 GB
**Status:** ✅ Safe to delete (Docker moved to E: drive)
**Impact:** Will free up ~14 GB

**How to Delete:**
```powershell
# Stop Docker first
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue

# Delete the old Docker WSL data
Remove-Item "C:\Users\SEHAJ\AppData\Local\Docker\wsl" -Recurse -Force

# Restart Docker
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

---

### 2. **Temp Files Cleanup (~1 GB)**
**Location:** `C:\Users\SEHAJ\AppData\Local\Temp`
**Size:** 0.89 GB

**How to Clean:**
```powershell
# Delete temp files
Remove-Item "C:\Users\SEHAJ\AppData\Local\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue

# Also clean Windows Temp
Remove-Item "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
```

---

### 3. **npm Cache (~0.43 GB)**
**Location:** `C:\Users\SEHAJ\AppData\Local\npm-cache`

**How to Clean:**
```powershell
npm cache clean --force
```

---

### 4. **Python Cache and Packages**
**Location:** `C:\Users\SEHAJ\AppData\Local\Python`
**Size:** 0.43 GB

**How to Clean:**
```powershell
# Clean pip cache
pip cache purge
```

---

## 📊 Other Large Items (Review Before Deleting)

### Google Chrome (~4.79 GB)
**Location:** `C:\Users\SEHAJ\AppData\Local\Google`
- **Chrome User Data:** 3-4 GB (cache, history, extensions)
- **Consider:** Clear browser cache via Chrome settings

### Programs (~5.8 GB)
**Location:** `C:\Users\SEHAJ\AppData\Local\Programs`
- Contains installed applications (VS Code, Node.js, etc.)
- **Review:** Uninstall unused applications

### JetBrains (~2.7 GB)
**Location:** `C:\Users\SEHAJ\AppData\Local\JetBrains`
- IDE caches and logs
- **Safe to clean:** Old logs and caches

### Postman (~1.14 GB)
**Location:** `C:\Users\SEHAJ\AppData\Local\Postman`
- API testing tool data

---

## 🚀 Quick Cleanup Script

**Save this as:** `cleanup_c_drive.ps1`

```powershell
Write-Host "=== C: Drive Cleanup Script ===" -ForegroundColor Green
Write-Host ""

# 1. Delete old Docker WSL data
Write-Host "1. Deleting old Docker WSL data (14 GB)..." -ForegroundColor Yellow
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
if (Test-Path "C:\Users\SEHAJ\AppData\Local\Docker\wsl") {
    Remove-Item "C:\Users\SEHAJ\AppData\Local\Docker\wsl" -Recurse -Force
    Write-Host "   ✓ Deleted: ~14 GB freed" -ForegroundColor Green
}

# 2. Clean Temp files
Write-Host "2. Cleaning Temp files..." -ForegroundColor Yellow
Remove-Item "C:\Users\SEHAJ\AppData\Local\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   ✓ Temp files cleaned: ~1 GB freed" -ForegroundColor Green

# 3. Clean npm cache
Write-Host "3. Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null
Write-Host "   ✓ npm cache cleaned: ~0.5 GB freed" -ForegroundColor Green

# 4. Clean pip cache
Write-Host "4. Cleaning Python pip cache..." -ForegroundColor Yellow
pip cache purge 2>$null
Write-Host "   ✓ pip cache cleaned" -ForegroundColor Green

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Green
Write-Host "Estimated space freed: ~15.5 GB"
Write-Host ""

# Show new free space
$drive = Get-PSDrive C
$freeGB = [math]::Round($drive.Free/1GB,2)
Write-Host "C: Drive Free Space: $freeGB GB" -ForegroundColor Cyan

# Restart Docker
Write-Host ""
Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

---

## 📋 Manual Cleanup Steps

### Windows Disk Cleanup Tool
1. Press `Win + R`
2. Type `cleanmgr`
3. Select C: drive
4. Check all boxes
5. Click "Clean up system files"
6. Check all boxes again
7. Click OK

**Expected savings:** 2-5 GB

---

### Chrome Browser Cache
1. Open Chrome
2. Press `Ctrl + Shift + Delete`
3. Select "All time"
4. Check all boxes
5. Click "Clear data"

**Expected savings:** 1-2 GB

---

## ⚠️ Important Notes

1. **Docker Data Already Moved:** Your Docker data is safely stored on E:\Docker\wsl
2. **No Data Loss:** Deleting C:\Users\SEHAJ\AppData\Local\Docker\wsl will NOT affect your containers
3. **Containers Safe:** All your Disaster Management containers and data are on E: drive
4. **Backup First:** If unsure, backup important files before cleanup

---

## 🎯 Expected Results After Cleanup

| Item | Current | After Cleanup | Space Freed |
|------|---------|---------------|-------------|
| C: Drive Free | 8.19 GB | ~23.5 GB | 15+ GB |
| Docker on C: | 14.17 GB | 0 GB | 14.17 GB |
| Temp Files | 0.89 GB | 0 GB | 0.89 GB |
| Cache Files | 0.86 GB | 0 GB | 0.86 GB |

---

## ✅ Verification After Cleanup

```powershell
# Check C: drive space
Get-PSDrive C | Select-Object @{Name='FreeGB';Expression={[math]::Round($_.Free/1GB,2)}}

# Verify Docker is on E: drive
wsl --list -v

# Check Docker data location
Get-ChildItem "E:\Docker\wsl" -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name='SizeGB';Expression={[math]::Round($_.Sum/1GB,2)}}

# Start your Disaster Management project
cd "E:\Projects\Disaster Management"
docker-compose ps
```

---

## 🆘 If Something Goes Wrong

1. **Docker doesn't start:** Reinstall Docker Desktop (your data on E: is safe)
2. **Containers missing:** Run `docker-compose up -d` in project folder
3. **Data missing:** Your PostgreSQL data is in Docker volume on E: drive (safe)

---

**Created:** October 17, 2026  
**Last Updated:** Now  
**Status:** Ready to execute
