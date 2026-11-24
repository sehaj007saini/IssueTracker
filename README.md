# 🏛️ Issue Tracker - Civic Issue Reporting Platform

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render)](https://issuetracker.onrender.com)
[![Backend Status](https://img.shields.io/badge/Backend-Live-success?style=for-the-badge)](https://issuetracker-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A modern, feature-rich civic issue reporting and management platform with real-time updates, gamification, and advanced analytics.

---

## 🚀 Live Demo

**🌐 Frontend Application**: [https://issuetracker.onrender.com](https://issuetracker.onrender.com)  
**⚙️ Backend API**: [https://issuetracker-backend.onrender.com](https://issuetracker-backend.onrender.com)

> **Note**: The free tier on Render may take 30-60 seconds to wake up if the service has been inactive.

---

## ✨ Features

### 🏠 Core Features
- 📝 **Report Issues** - Submit civic issues with photos and location
- 🗺️ **Interactive Map** - View issues on a map with clustering
- 📊 **Real-time Stats** - Live community statistics dashboard
- 🔔 **Notifications** - Real-time updates on issue status
- 💬 **Comments** - Discuss issues with the community
- ✅ **Verification** - Confirm when issues are resolved

### 🎮 Gamification
- 🏆 **Leaderboard** - Community rankings based on contributions
- 🏅 **Badges** - Earn badges for achievements (6 rarity levels)
- ⭐ **Points System** - Accumulate points for activities
- 📈 **Impact Score** - Track your community impact

### 🔥 Advanced Features
- **Trending Issues** - See what's hot in your community
- **Advanced Search** - Powerful filtering and sorting
- **Personal Analytics** - Track your contributions with charts
- **Theme Customizer** - 6 beautiful themes to choose from
- **Fraud Detection** - Multi-layer validation system
- **User Reputation** - Scoring system to prevent spam

### 🎨 UI/UX
- ✨ Modern glassmorphism design
- 🌙 Comprehensive dark mode
- 📱 Fully responsive mobile-first design
- ⚡ Smooth animations and transitions
- 🎨 Customizable themes and preferences

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS with custom extensions
- **State Management**: React Query
- **Routing**: React Router v6
- **Maps**: Leaflet + React Leaflet
- **Real-time**: WebSocket (STOMP)
- **Build Tool**: Vite

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: PostgreSQL 16 + PostGIS
- **Authentication**: JWT
- **Security**: Spring Security
- **Migrations**: Flyway
- **Build Tool**: Maven

### Deployment
- **Platform**: Render.com
- **Database**: Managed PostgreSQL
- **CI/CD**: Auto-deploy on git push
- **Containerization**: Docker

---

## 📱 Screenshots

### Homepage with Real-time Stats
![Homepage](docs/screenshots/homepage.png)

### Trending Issues Feed
![Trending](docs/screenshots/trending.png)

### Community Leaderboard
![Leaderboard](docs/screenshots/leaderboard.png)

### Interactive Map View
![Map](docs/screenshots/map.png)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- PostgreSQL 16+
- Maven 3.8+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

### Database Setup

```bash
docker-compose up -d
```

This will start PostgreSQL with PostGIS extension.

---

## 📂 Project Structure

```
.
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source code
│   │   │   └── resources/  # Config files & migrations
│   │   └── test/           # Test files
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Local development setup
├── render.yaml            # Render deployment config
└── README.md
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP

### Issues
- `GET /api/issues` - List all issues
- `POST /api/issues` - Create new issue
- `GET /api/issues/{id}` - Get issue details
- `PUT /api/issues/{id}` - Update issue
- `POST /api/issues/{id}/support` - Support an issue

### Comments
- `GET /api/issues/{id}/comments` - Get comments
- `POST /api/issues/{id}/comments` - Add comment

### Analytics
- `GET /api/analytics/overview` - Get system analytics
- `GET /api/analytics/user/{id}` - Get user analytics

---

## 🔐 Environment Variables

### Backend (.env or Render environment)
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/disaster_management
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_secret_key_min_256_bits
CORS_ALLOWED_ORIGINS=http://localhost:5173
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
PORT=8080
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

---

## 🚀 Deployment

### Deploy to Render (Automatic)

1. Push to GitHub:
```bash
git push origin main
```

2. Render automatically:
   - Detects the push
   - Builds Docker containers
   - Deploys backend and frontend
   - Updates are live in 5-10 minutes

### Manual Deploy

See `render.yaml` for configuration details.

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
./mvnw test
```

---

## 📊 Database Migrations

Migrations are managed by Flyway and run automatically on startup.

Location: `backend/src/main/resources/db/migration/`

To create a new migration:
1. Create file: `V{number}__{description}.sql`
2. Add SQL commands
3. Restart application

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [sehaj007saini](https://github.com/sehaj007saini)

---

## 🙏 Acknowledgments

- Spring Boot community
- React community
- TailwindCSS team
- Render.com for hosting
- PostgreSQL + PostGIS for geospatial features

---

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

## 🔗 Links

- **Live Application**: [https://issuetracker.onrender.com](https://issuetracker.onrender.com)
- **API Documentation**: [https://issuetracker-backend.onrender.com/swagger-ui.html](https://issuetracker-backend.onrender.com/swagger-ui.html)
- **GitHub Repository**: [https://github.com/sehaj007saini/IssueTracker](https://github.com/sehaj007saini/IssueTracker)

---

## 📈 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/sehaj007saini/IssueTracker?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/sehaj007saini/IssueTracker?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/sehaj007saini/IssueTracker?style=flat-square)

**Status**: ✅ Active Development

---

Made with ❤️ for making communities better
