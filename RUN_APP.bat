@echo off
echo ========================================
echo Disaster Management - Running Backend
echo ========================================
echo.

cd backend

echo Setting JAVA_HOME...
set JAVA_HOME=C:\Program Files\Java\jdk-25

echo Starting Spring Boot application...
echo.
echo The backend will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server.
echo.

mvnw.cmd spring-boot:run

pause
