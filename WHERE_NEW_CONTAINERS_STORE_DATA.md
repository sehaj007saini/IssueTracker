# Where New Containers Will Store Data

## ✅ Configuration Status

### Docker Desktop Setting
```
"dataFolder": "E:\Docker"
```
**Location**: `C:\Users\SEHAJ\AppData\Roaming\Docker\settings.json`

---

## Storage Locations for New Containers

### 1. Container Internal Data (Images, Layers, System Files)
**Stored in**: `E:\Docker\wsl\data\docker_data.vhdx`
- Docker images
- Container file systems
- Networks
- Build cache
- Unnamed volumes

**Example**: When you run `docker pull postgres:latest` or build an image, it goes here.

---

### 2. Your Project Containers (Current Setup)
**Stored in**: `E:\Projects\Disaster Management\docker-volumes\`

Your `docker-compose.yml` explicitly uses **bind mounts** to E drive:
```yaml
volumes:
  - ./docker-volumes/postgres:/var/lib/postgresql/data    # E drive
  - ./docker-volumes/uploads:/app/uploads                 # E drive
```

✅ **Result**: All container data stays on **E drive**

---

### 3. Future Containers - Where Will They Store?

#### Scenario A: Using This Project's docker-compose.yml
**Storage**: `E:\Projects\Disaster Management\docker-volumes\`
- Because volumes are configured as `./docker-volumes/...`
- The `./` means relative to the docker-compose.yml file location
- ✅ **On E drive**

#### Scenario B: Creating New Containers with Bind Mounts
```yaml
volumes:
  - /absolute/path/to/data:/container/path
```
- **Storage**: Wherever you specify the path
- ✅ **You control the location**

#### Scenario C: Creating New Containers with Named Volumes
```yaml
volumes:
  my-named-volume:
    driver: local

services:
  myapp:
    volumes:
      - my-named-volume:/data
```
- **Storage**: `E:\Docker\wsl\data\docker_data.vhdx` (inside the virtual disk)
- ✅ **On E drive** (because Docker Desktop dataFolder is E:\Docker)

#### Scenario D: Creating Containers Without Volume Specification
```bash
docker run -d postgres
```
- **Storage**: `E:\Docker\wsl\data\docker_data.vhdx`
- Data stored inside the virtual disk on E drive
- ✅ **On E drive**

---

## Examples

### Example 1: Run a New Database
```bash
docker run -d --name mydb -e POSTGRES_PASSWORD=pass postgres
```
**Data location**: `E:\Docker\wsl\data\docker_data.vhdx` ✅ E drive

### Example 2: Run with Volume on E Drive
```bash
docker run -d --name mydb -v E:\MyData\db:/var/lib/postgresql/data postgres
```
**Data location**: `E:\MyData\db\` ✅ E drive

### Example 3: Run with Named Volume
```bash
docker volume create my-data
docker run -d --name mydb -v my-data:/var/lib/postgresql/data postgres
```
**Data location**: Inside `E:\Docker\wsl\data\docker_data.vhdx` ✅ E drive

### Example 4: Using Current Project
```bash
cd "E:\Projects\Disaster Management"
docker-compose up -d
```
**Data location**: `E:\Projects\Disaster Management\docker-volumes\` ✅ E drive

---

## Summary

| Container Type | Storage Location | Drive |
|---------------|------------------|-------|
| Docker system files | `E:\Docker\wsl\data\docker_data.vhdx` | ✅ E |
| Your current project | `E:\Projects\Disaster Management\docker-volumes\` | ✅ E |
| New containers with bind mounts | Where you specify | Your choice |
| New containers with named volumes | Inside `E:\Docker\wsl\data\docker_data.vhdx` | ✅ E |
| New containers without volumes | Inside `E:\Docker\wsl\data\docker_data.vhdx` | ✅ E |

## 🎉 Result
**ALL new containers will store data on E drive by default**, because:
1. Docker Desktop is configured with `dataFolder: E:\Docker`
2. All Docker virtual disks are on E drive
3. Your project uses explicit E drive paths

---

## Verification

To verify where Docker stores data:
```powershell
# Check Docker Desktop setting
Get-Content "C:\Users\SEHAJ\AppData\Roaming\Docker\settings.json" | Select-String "dataFolder"

# Check virtual disk location
Get-ChildItem "E:\Docker\wsl\data" -File

# Check project volumes
Get-ChildItem "E:\Projects\Disaster Management\docker-volumes"
```
