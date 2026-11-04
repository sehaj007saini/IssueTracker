@echo off
echo ========================================
echo Disaster Management - Docker Deployment
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit .env file and set your passwords!
    echo Press any key to open .env file...
    pause >nul
    notepad .env
    echo.
)

echo Starting Docker containers...
echo.
docker-compose up -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Application is starting...
    echo ========================================
    echo.
    echo Services:
    echo   Frontend:  http://localhost:3000
    echo   Backend:   http://localhost:8080
    echo   Database:  localhost:5432
    echo.
    echo View logs:    docker-compose logs -f
    echo Stop:         docker-compose down
    echo Restart:      docker-compose restart
    echo.
    echo Waiting for services to be ready...
    timeout /t 10 /nobreak >nul
    echo.
    echo Opening application in browser...
    start http://localhost:3000
) else (
    echo.
    echo ========================================
    echo ERROR: Docker deployment failed!
    echo ========================================
    echo.
    echo Check the error messages above.
    echo.
    echo Common fixes:
    echo   1. Make sure Docker Desktop is running
    echo   2. Check if ports 3000, 8080, 5432 are available
    echo   3. Try: docker-compose down -v
    echo   4. Then run this script again
    echo.
)

pause
