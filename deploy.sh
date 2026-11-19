#!/bin/bash

###############################################################################
# IssueTracker Deployment Script
# Quick deployment for Ubuntu servers (20.04/22.04)
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          IssueTracker Deployment Script v1.0             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use sudo)${NC}" 
   exit 1
fi

# Function to print status
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Step 1: Update system
echo -e "\n${YELLOW}Step 1: Updating system...${NC}"
apt update && apt upgrade -y
print_status "System updated"

# Step 2: Install Docker
echo -e "\n${YELLOW}Step 2: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_status "Docker installed"
else
    print_status "Docker already installed"
fi

# Step 3: Install Docker Compose
echo -e "\n${YELLOW}Step 3: Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed"
else
    print_status "Docker Compose already installed"
fi

# Step 4: Install Git
echo -e "\n${YELLOW}Step 4: Installing Git...${NC}"
if ! command -v git &> /dev/null; then
    apt install git -y
    print_status "Git installed"
else
    print_status "Git already installed"
fi

# Step 5: Clone repository
echo -e "\n${YELLOW}Step 5: Setting up application...${NC}"
read -p "Enter installation directory [/opt/issuetracker]: " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-/opt/issuetracker}

if [ -d "$INSTALL_DIR" ]; then
    print_warning "Directory exists. Pulling latest changes..."
    cd "$INSTALL_DIR"
    git pull origin main
else
    print_status "Cloning repository to $INSTALL_DIR"
    git clone https://github.com/sehaj007saini/IssueTracker.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Step 6: Configure environment
echo -e "\n${YELLOW}Step 6: Configuring environment...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file. Please provide the following information:${NC}\n"
    
    # Database password
    read -sp "Enter database password (min 16 chars): " DB_PASSWORD
    echo
    
    # JWT secret
    echo "Generating JWT secret..."
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    
    # Server IP
    SERVER_IP=$(curl -s ifconfig.me)
    echo "Detected server IP: $SERVER_IP"
    read -p "Enter your domain name (or press Enter to use IP): " DOMAIN
    DOMAIN=${DOMAIN:-$SERVER_IP}
    
    # Twilio (optional)
    read -p "Do you have Twilio credentials? (y/n): " HAS_TWILIO
    if [[ $HAS_TWILIO == "y" ]]; then
        read -p "Twilio Account SID: " TWILIO_SID
        read -sp "Twilio Auth Token: " TWILIO_TOKEN
        echo
        read -p "Twilio Phone Number: " TWILIO_PHONE
    else
        TWILIO_SID="your_twilio_sid"
        TWILIO_TOKEN="your_twilio_token"
        TWILIO_PHONE="+1234567890"
    fi
    
    # Create .env file
    cat > .env << EOF
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=disaster_management
DB_USER=postgres
DB_PASSWORD=$DB_PASSWORD

# Backend
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=86400000
SPRING_PROFILES_ACTIVE=prod

# Twilio
TWILIO_ACCOUNT_SID=$TWILIO_SID
TWILIO_AUTH_TOKEN=$TWILIO_TOKEN
TWILIO_PHONE_NUMBER=$TWILIO_PHONE
TWILIO_WHATSAPP_NUMBER=whatsapp:$TWILIO_PHONE

# Frontend
VITE_API_BASE_URL=http://$DOMAIN:8080/api
VITE_WS_URL=ws://$DOMAIN:8080/ws

# File Storage
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ALLOWED_ORIGINS=http://$DOMAIN:3000,http://$DOMAIN,https://$DOMAIN
EOF
    
    print_status "Environment configured"
else
    print_warning ".env file already exists, skipping..."
fi

# Step 7: Start application
echo -e "\n${YELLOW}Step 7: Starting application...${NC}"
docker-compose down 2>/dev/null || true
docker-compose up -d --build

print_status "Application started"

# Step 8: Wait for services
echo -e "\n${YELLOW}Step 8: Waiting for services to be ready...${NC}"
echo "This may take 2-3 minutes..."

sleep 30

# Check backend health
for i in {1..12}; do
    if docker-compose logs backend 2>/dev/null | grep -q "Started LocalProblemsOsApplication"; then
        print_status "Backend is ready"
        break
    fi
    echo -n "."
    sleep 10
done

# Step 9: Install Nginx (optional)
echo -e "\n${YELLOW}Step 9: Web server setup${NC}"
read -p "Do you want to install Nginx as reverse proxy? (recommended) (y/n): " INSTALL_NGINX

if [[ $INSTALL_NGINX == "y" ]]; then
    apt install nginx -y
    
    # Create Nginx config
    cat > /etc/nginx/sites-available/issuetracker << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
EOF
    
    ln -sf /etc/nginx/sites-available/issuetracker /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl restart nginx
    print_status "Nginx configured"
fi

# Step 10: Setup firewall
echo -e "\n${YELLOW}Step 10: Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow ssh
    ufw allow 'Nginx Full' 2>/dev/null || ufw allow 80 && ufw allow 443
    ufw --force enable
    print_status "Firewall configured"
fi

# Step 11: Setup SSL (optional)
echo -e "\n${YELLOW}Step 11: SSL Certificate${NC}"
read -p "Do you want to setup SSL with Let's Encrypt? (requires domain) (y/n): " SETUP_SSL

if [[ $SETUP_SSL == "y" ]]; then
    apt install certbot python3-certbot-nginx -y
    echo -e "${YELLOW}Run this command after DNS is configured:${NC}"
    echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# Step 12: Setup backups
echo -e "\n${YELLOW}Step 12: Setting up automated backups...${NC}"

mkdir -p /opt/backups

cat > /opt/backups/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
docker exec disaster_postgres pg_dump -U postgres disaster_management | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /opt/backups/backup.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/backup.sh >> /var/log/db-backup.log 2>&1") | crontab -

print_status "Automated backups configured (daily at 2 AM)"

# Final status
echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════╗"
echo "║            Deployment Completed Successfully!            ║"
echo "╚═══════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${YELLOW}Application URLs:${NC}"
echo "  Frontend: http://$DOMAIN (or http://$SERVER_IP:3000)"
echo "  Backend API: http://$DOMAIN/api (or http://$SERVER_IP:8080/api)"
echo -e "\n${YELLOW}Default Credentials:${NC}"
echo "  Email: admin@example.com"
echo "  Password: Admin@123"
echo -e "\n${RED}⚠️  IMPORTANT: Change default password immediately!${NC}"

echo -e "\n${YELLOW}Useful Commands:${NC}"
echo "  View logs:       docker-compose -f $INSTALL_DIR/docker-compose.yml logs -f"
echo "  Restart:         docker-compose -f $INSTALL_DIR/docker-compose.yml restart"
echo "  Stop:            docker-compose -f $INSTALL_DIR/docker-compose.yml down"
echo "  Update:          cd $INSTALL_DIR && git pull && docker-compose up -d --build"
echo "  Backup DB:       /opt/backups/backup.sh"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "  1. Configure DNS records to point to $SERVER_IP"
echo "  2. Setup SSL certificate with: sudo certbot --nginx -d $DOMAIN"
echo "  3. Change default admin password"
echo "  4. Configure Twilio credentials in .env if not done"
echo "  5. Test fraud detection system"
echo "  6. Review security settings"

echo -e "\n${GREEN}For detailed documentation, see DEPLOYMENT_GUIDE.md${NC}\n"
