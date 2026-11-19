# 🚨 Disaster Management System

A comprehensive civic issue reporting and resolution platform with real-time tracking, geospatial mapping, and multi-channel notifications.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## 📋 Overview

The Disaster Management System is a full-stack web application that enables citizens to report civic issues, track their resolution status, and engage with local authorities. Built with modern technologies, it features real-time notifications, interactive maps, and role-based access control.

### Key Features

- 🔐 **Multi-method Authentication** - Email/password and OTP-based login (SMS/WhatsApp)
- 📍 **Geospatial Mapping** - Interactive maps with PostGIS-powered location tracking
- 📷 **Camera Capture** - Take photos directly from device camera for instant reporting
- 🎤 **Voice Input** - Speech-to-text for describing issues hands-free
- 🌙 **Dark Mode** - Eye-friendly dark theme with seamless toggle
- 📸 **Multiple Photos** - Upload up to 5 evidence photos per issue
- 🖼️ **Image Compression** - Automatic image optimization before upload
- 📤 **Social Sharing** - Share issues on WhatsApp, Facebook, Twitter, and more
- 📊 **Status Timeline** - Visual progress tracking with timeline view
- 📡 **Real-time Feed** - Live updates of new issues as they're reported
- 🔍 **Advanced Search** - Comprehensive filtering by category, status, date, location
- 👤 **User Profiles** - Detailed profiles with statistics, badges, and reputation
- ⚡ **Priority System** - AI-based priority ranking (Critical, High, Medium, Low)
- 📥 **Export Reports** - Download data as PDF, Excel, or CSV
- ⌨️ **Keyboard Shortcuts** - Power-user shortcuts for quick navigation
- 🎯 **Command Palette** - Quick actions menu (Ctrl+K)
- 🔔 **Notification Center** - Centralized notification management
- 📱 **PWA Support** - Install as app, works offline
- 🔄 **Real-time Updates** - WebSocket notifications for instant status changes
- 👥 **Role-based Access** - Distinct workflows for Citizens, Officers, and Admins
- 📱 **Multi-channel Notifications** - SMS and WhatsApp via Twilio
- 🌍 **Multi-language Support** - English and Hindi with extensible i18n
- 📊 **Analytics Dashboard** - Comprehensive insights for administrators
- 🔍 **Smart Duplicate Detection** - Automatic identification of similar issues

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: PostgreSQL 16 with PostGIS extension
- **Authentication**: JWT with Spring Security
- **Real-time**: WebSocket (STOMP)
- **Notifications**: Twilio SDK (SMS/WhatsApp)
- **Caching**: Caffeine Cache
- **Migrations**: Flyway

#### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Maps**: Leaflet with React-Leaflet
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **i18n**: React-i18next

#### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend)
- **Database**: PostgreSQL with PostGIS

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed and running
- 4 GB RAM minimum
- 10 GB free disk space
- Ports available: 3000, 8080, 5432

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sehaj007saini/IssueTracker.git
cd IssueTracker
```

2. **Configure environment variables**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# Required: DB_PASSWORD, JWT_SECRET
# Optional: Twilio credentials for SMS/WhatsApp
```

3. **Start the application**
```bash
docker-compose up -d
```

4. **Wait for services to start** (~60 seconds)
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
- Database: localhost:5432



## 🎯 User Roles & Features

### 👤 Citizens
- Register and authenticate (email/password or OTP)
- Report issues with location and photo evidence
- **Capture photos directly from camera** 📷
- **Upload multiple photos** (up to 5 per issue) 📸
- **Share issues on social media** 📤
- **View status timeline** with visual progress 📊
- **Switch to dark mode** for better viewing 🌙
- Track issue status in real-time
- View issues on interactive map
- Support/upvote issues
- Comment on issues
- Receive notifications

### 👮 Officers
- View assigned issues by department/ward
- Update issue status through lifecycle
- Submit resolution with photo proof
- Add progress updates
- Communicate with citizens

### 👑 Administrators
- View analytics dashboard
- Monitor resolution rates
- Manage departments and wards
- User management
- System-wide oversight

## 🗄️ Database Schema

The system uses PostgreSQL 16 with PostGIS extension for spatial data support.

### Core Tables
- `users` - User accounts and authentication
- `issues` - Main issue table with geospatial data
- `issue_reports` - Citizen reports (multiple per issue)
- `issue_evidence` - Photo evidence
- `departments` - Government departments
- `wards` - Geographic divisions
- `notifications` - User notifications
- `notification_preferences` - User settings

## 🔒 Security

- JWT-based authentication with 24-hour expiration
- BCrypt password hashing (strength: 12)
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention (JPA/Hibernate)
- XSS protection
- CORS configuration
- Secure file uploads with validation

## 📦 Project Structure

```
disaster-management-system/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source code
│   │   │   └── resources/  # Configuration & migrations
│   │   └── test/           # Backend tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── i18n/          # Internationalization
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── docker-volumes/        # Persistent data (git-ignored)
│   ├── postgres/
│   └── uploads/
├── docker-compose.yml     # Container orchestration
├── .env.example          # Environment template
└── README.md
```

## 🛠️ Development

### Backend Development

```bash
# Navigate to backend directory
cd backend

# Run with Maven (requires Java 17)
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR
./mvnw clean package
```

### Frontend Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Database Migrations

Flyway migrations are automatically applied on startup. Migration files are located in:
```
backend/src/main/resources/db/migration/
```

## 🧪 Testing

```bash
# Test all services
docker-compose exec backend ./mvnw test
docker-compose exec frontend npm test

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🌍 Environment Variables

### Required
```env
DB_PASSWORD=your_secure_password
JWT_SECRET=your-256-bit-secret-key
```

### Optional (Twilio Integration)
```env
TWILIO_ENABLED=false
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
TWILIO_WHATSAPP_NUMBER=your_whatsapp_number
```

## 📊 Performance

- Response time: < 200ms for most API calls
- Map rendering: Optimized with marker clustering
- Database: PostGIS spatial indexing
- Frontend: Code splitting and lazy loading
- Caching: Caffeine cache for OTP storage

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- PostGIS for spatial database capabilities
- Leaflet for interactive mapping
- Twilio for messaging infrastructure
- All contributors and supporters

## 📞 Support

- Issues: [GitHub Issues](https://github.com/sehaj007saini/IssueTracker/issues)
- Email: sehajsainif5@gmail.com

## 🗺️ Roadmap

- [x] Camera capture for photos
- [x] Dark mode support
- [x] Multiple photos upload
- [x] Social media sharing
- [x] Status timeline visualization
- [x] Real-time issue feed
- [x] Advanced search & filters
- [x] User profile & statistics
- [x] Priority ranking system
- [x] Export reports (PDF/Excel/CSV)
- [x] Voice input for reporting
- [x] Image compression & optimization
- [x] Keyboard shortcuts
- [x] Command palette (Ctrl+K)
- [x] Notification center
- [x] PWA support (install as app)
- [ ] Email notifications
- [ ] AI-powered categorization
- [ ] Chatbot support
- [ ] Mobile app (React Native)
- [ ] Image recognition
- [ ] Video evidence support
- [ ] Public API for integrations
- [ ] Automated issue routing
- [ ] Multi-tenancy support

## 📸 Screenshots

_Coming soon_

---

**Made with ❤️ by Sehaj Saini**

**Star ⭐ this repository if you find it helpful!**
