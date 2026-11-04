# How to Move Docker Desktop Data from C Drive to E Drive

## Current Space Usage
- **Docker Data on C Drive**: ~4.79 GB in `C:\Users\SEHAJ\AppData\Local\Docker`
- **C Drive Free Space**: 9.41 GB (after cleanup)
- **Space Freed So Far**: 2.1 GB from Docker cache

## Already Completed ✓
1. ✅ Project volumes moved from C to E drive (docker-volumes folder)
2. ✅ Docker build cache cleaned (2.1 GB freed)
3. ✅ Old Docker volumes removed
4. ✅ npm cache cleaned

## Steps to Move Docker Desktop Data to E Drive

### Method 1: Using Docker Desktop Settings (Recommended)

1. **Open Docker Desktop**
   - Click the Docker icon in system tray
   - Go to Settings (⚙️)

2. **Change Data Location**
   - Go to **Resources** → **Advanced**
   - Look for "Disk image location" or "WSL 2" settings
   - Change from `C:\Users\SEHAJ\AppData\Local\Docker` to `E:\Docker`

3. **Apply & Restart**
   - Click "Apply & Restart"
   - Docker will move the data automatically

### Method 2: Manual Migration (If Settings Don't Work)

1. **Stop Docker Desktop completely**
   ```powershell
   # Stop Docker Desktop from system tray or:
   Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue
   ```

2. **Create new Docker directory on E drive**
   ```powershell
   mkdir E:\Docker
   ```

3. **Export WSL distribution (if using WSL 2 backend)**
   ```powershell
   wsl --export docker-desktop E:\Docker\docker-desktop.tar
   wsl --export docker-desktop-data E:\Docker\docker-desktop-data.tar
   ```

4. **Unregister old distributions**
   ```powershell
   wsl --unregister docker-desktop
   wsl --unregister docker-desktop-data
   ```

5. **Import to new location**
   ```powershell
   wsl --import docker-desktop E:\Docker\desktop E:\Docker\docker-desktop.tar --version 2
   wsl --import docker-desktop-data E:\Docker\data E:\Docker\docker-desktop-data.tar --version 2
   ```

6. **Delete temporary tar files**
   ```powershell
   Remove-Item E:\Docker\*.tar
   ```

7. **Start Docker Desktop**
   - Verify everything works
   - Check: `docker ps` should show your containers

### Method 3: Using Symbolic Link (Quick but Advanced)

1. **Stop Docker Desktop**

2. **Move the folder**
   ```powershell
   Move-Item "C:\Users\SEHAJ\AppData\Local\Docker" "E:\Docker"
   ```

3. **Create symbolic link**
   ```powershell
   New-Item -ItemType SymbolicLink -Path "C:\Users\SEHAJ\AppData\Local\Docker" -Target "E:\Docker"
   ```

4. **Start Docker Desktop**

## Additional Space Saving Tips

### Clean More Docker Data
```powershell
# Remove all unused data (images, containers, volumes, networks)
docker system prune -a --volumes -f
```

### Clean Windows Update Cache (Can free 5-10 GB)
```powershell
# Run as Administrator
Dism.exe /online /Cleanup-Image /StartComponentCleanup
```

### Clean System Temp Files
```powershell
# Clear Windows temp folder
cleanmgr /d c:
```

### Move Other Large Directories to E Drive
- `%USERPROFILE%\.m2` (Maven - currently 0.77 GB)
- `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps`
- Browser caches (Chrome, Edge, Firefox)

## Verification After Moving Docker

1. **Check Docker is running**
   ```powershell
   docker ps
   ```

2. **Check containers are accessible**
   ```powershell
   docker-compose ps
   ```

3. **Verify database data**
   ```powershell
   docker exec disaster-mgmt-db psql -U postgres -d Disaster_Management -c "SELECT COUNT(*) FROM users;"
   ```

4. **Check C drive space**
   ```powershell
   Get-PSDrive C | Select-Object @{Name="FreeGB";Expression={[math]::Round($_.Free/1GB,2)}}
   ```

## Expected Results
- **Space freed on C drive**: ~5-7 GB (Docker data + caches)
- **C drive free space after**: ~15-17 GB
- **All data intact**: Database, uploads, project files preserved
