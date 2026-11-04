#!/bin/bash

echo "========================================"
echo "Disaster Management - Docker Deployment"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo ""
    echo "Please start Docker and try again."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Edit .env file and set your passwords!"
    echo "Press Enter to continue after editing .env..."
    read -p ""
fi

echo "Starting Docker containers..."
echo ""
docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "SUCCESS! Application is starting..."
    echo "========================================"
    echo ""
    echo "Services:"
    echo "  Frontend:  http://localhost:3000"
    echo "  Backend:   http://localhost:8080"
    echo "  Database:  localhost:5432"
    echo ""
    echo "View logs:    docker-compose logs -f"
    echo "Stop:         docker-compose down"
    echo "Restart:      docker-compose restart"
    echo ""
    echo "Waiting for services to be ready..."
    sleep 10
    echo ""
    echo "Opening application in browser..."
    
    # Open browser based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:3000
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open http://localhost:3000 2>/dev/null || echo "Open http://localhost:3000 in your browser"
    fi
else
    echo ""
    echo "========================================"
    echo "ERROR: Docker deployment failed!"
    echo "========================================"
    echo ""
    echo "Check the error messages above."
    echo ""
    echo "Common fixes:"
    echo "  1. Make sure Docker is running"
    echo "  2. Check if ports 3000, 8080, 5432 are available"
    echo "  3. Try: docker-compose down -v"
    echo "  4. Then run this script again"
    echo ""
fi
