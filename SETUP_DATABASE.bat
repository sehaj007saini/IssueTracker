@echo off
echo ========================================
echo Disaster Management - Database Setup
echo ========================================
echo.

echo Step 1: Installing PostGIS Extension
echo -------------------------------------
echo You need to install PostGIS for PostgreSQL 18.
echo.
echo Download from: https://postgis.net/windows_downloads/
echo Or use Stack Builder (comes with PostgreSQL installation)
echo.
echo After installing PostGIS, press any key to continue...
pause

echo.
echo Step 2: Setting up database
echo ----------------------------
echo This will create the database and enable PostGIS extension.
echo.

REM Try to find PostgreSQL installation
set PGBIN=C:\Program Files\PostgreSQL\18\bin
if not exist "%PGBIN%\psql.exe" (
    set PGBIN=C:\Program Files\PostgreSQL\17\bin
)
if not exist "%PGBIN%\psql.exe" (
    set PGBIN=C:\Program Files\PostgreSQL\16\bin
)
if not exist "%PGBIN%\psql.exe" (
    set PGBIN=C:\Program Files\PostgreSQL\15\bin
)

if not exist "%PGBIN%\psql.exe" (
    echo PostgreSQL psql.exe not found!
    echo Please run these commands manually in psql:
    echo.
    echo CREATE DATABASE "Disaster_Management";
    echo \c Disaster_Management
    echo CREATE EXTENSION IF NOT EXISTS postgis;
    echo.
    pause
    exit /b 1
)

echo Found PostgreSQL at: %PGBIN%
echo.
echo Enter PostgreSQL password for user 'postgres':

REM Create database and enable PostGIS
"%PGBIN%\psql.exe" -U postgres -c "CREATE DATABASE \"Disaster_Management\";" 2>nul
"%PGBIN%\psql.exe" -U postgres -d "Disaster_Management" -c "CREATE EXTENSION IF NOT EXISTS postgis;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database is ready.
    echo ========================================
    echo.
    echo Database: Disaster_Management
    echo PostGIS: Enabled
    echo.
    echo You can now run the backend:
    echo    cd backend
    echo    mvnw.cmd spring-boot:run
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database setup failed!
    echo ========================================
    echo.
    echo Please install PostGIS first, then run this script again.
    echo.
)

pause
