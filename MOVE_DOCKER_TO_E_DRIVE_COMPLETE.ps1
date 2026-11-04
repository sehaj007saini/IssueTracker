# Complete Docker Migration from C to E Drive
# Run this script as Administrator

Write-Host "=== DOCKER MIGRATION TO E DRIVE ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop Docker
Write-Host "Step 1: Stopping Docker Desktop and WSL..." -ForegroundColor Yellow
Stop-Process -Name "*Docker*" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
wsl --shutdown
Start-Sleep -Seconds 5
Write-Host "✓ Stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Export WSL distributions
Write-Host "Step 2: Exporting Docker WSL distributions..." -ForegroundColor Yellow
$exportPath = "E:\DockerMigration"
New-Item -Path $exportPath -ItemType Directory -Force | Out-Null

$distributions = wsl -l -q | Where-Object { $_ -match "docker" }
foreach ($dist in $distributions) {
    $distName = $dist.Trim()
    if ($distName) {
        Write-Host "  Exporting $distName..." -ForegroundColor Gray
        wsl --export $distName "$exportPath\$distName.tar"
    }
}
Write-Host "✓ Exported" -ForegroundColor Green
Write-Host ""

# Step 3: Unregister old distributions
Write-Host "Step 3: Unregistering old WSL distributions..." -ForegroundColor Yellow
foreach ($dist in $distributions) {
    $distName = $dist.Trim()
    if ($distName) {
        Write-Host "  Unregistering $distName..." -ForegroundColor Gray
        wsl --unregister $distName
    }
}
Write-Host "✓ Unregistered" -ForegroundColor Green
Write-Host ""

# Step 4: Delete old Docker folders
Write-Host "Step 4: Removing old Docker data from C drive..." -ForegroundColor Yellow
$foldersToRemove = @(
    "C:\Users\$env:USERNAME\AppData\Local\Docker",
    "C:\Users\$env:USERNAME\AppData\Roaming\Docker",
    "C:\Users\$env:USERNAME\.docker"
)

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        Write-Host "  Removing $folder..." -ForegroundColor Gray
        cmd /c rmdir /s /q "$folder" 2>$null
    }
}
Write-Host "✓ Removed" -ForegroundColor Green
Write-Host ""

# Step 5: Create new structure on E drive
Write-Host "Step 5: Creating Docker structure on E drive..." -ForegroundColor Yellow
$newDockerPath = "E:\Docker"
New-Item -Path "$newDockerPath\wsl" -ItemType Directory -Force | Out-Null
Write-Host "✓ Created E:\Docker" -ForegroundColor Green
Write-Host ""

# Step 6: Import distributions to E drive
Write-Host "Step 6: Importing WSL distributions to E drive..." -ForegroundColor Yellow
foreach ($dist in $distributions) {
    $distName = $dist.Trim()
    if ($distName -and (Test-Path "$exportPath\$distName.tar")) {
        Write-Host "  Importing $distName to E:\Docker\wsl..." -ForegroundColor Gray
        wsl --import $distName "$newDockerPath\wsl\$distName" "$exportPath\$distName.tar" --version 2
    }
}
Write-Host "✓ Imported" -ForegroundColor Green
Write-Host ""

# Step 7: Create Docker Desktop settings
Write-Host "Step 7: Configuring Docker Desktop settings..." -ForegroundColor Yellow
$dockerConfigPath = "C:\Users\$env:USERNAME\AppData\Roaming\Docker"
New-Item -Path $dockerConfigPath -ItemType Directory -Force | Out-Null

$settingsJson = @{
    "dataFolder" = "E:\Docker"
    "wslEngineEnabled" = $true
} | ConvertTo-Json

$settingsJson | Out-File -FilePath "$dockerConfigPath\settings.json" -Encoding UTF8 -Force
Write-Host "✓ Settings configured" -ForegroundColor Green
Write-Host ""

# Step 8: Cleanup
Write-Host "Step 8: Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item -Path $exportPath -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ Cleaned" -ForegroundColor Green
Write-Host ""

# Step 9: Check space
Write-Host "Step 9: Checking drive space..." -ForegroundColor Yellow
$cDrive = Get-PSDrive C
$eDrive = Get-PSDrive E
Write-Host "  C Drive Free: $([math]::Round($cDrive.Free/1GB, 2)) GB" -ForegroundColor Cyan
Write-Host "  E Drive Free: $([math]::Round($eDrive.Free/1GB, 2)) GB" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== MIGRATION COMPLETE ===" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Start Docker Desktop manually"
Write-Host "2. Wait for it to initialize (may take 2-3 minutes)"
Write-Host "3. Run: docker ps"
Write-Host "4. Run: cd 'E:\Projects\Disaster Management' && docker-compose up -d"
Write-Host ""
Write-Host "All future Docker data will be stored on E drive!" -ForegroundColor Green
