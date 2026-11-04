# India Local Problems OS - Backend

Spring Boot backend for the civic issue reporting platform.

## Prerequisites

- **Java 21** or higher
- **Maven 3.8+**
- **PostgreSQL 15+** with PostGIS extension
- **Git**

## Database Setup

### 1. Install PostgreSQL with PostGIS

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib postgis
```

**macOS (using Homebrew):**
```bash
brew install postgresql postgis
brew services start postgresql
```

**Windows:**
Download and install from [PostgreSQL official site](https://www.postgresql.org/download/windows/)
Install PostGIS via Stack Builder or as a separate download.

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE local_problems_db;

# Connect to the database
\c local_problems_db

# Enable PostGIS extension
CREATE EXTENSION postgis;

# Verify PostGIS installation
SELECT PostGIS_version();

# Exit
\q
```

### 3. Configure Database Credentials

Create a `.env` file in the `backend` directory (or set environment variables):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=local_problems_db
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your-secret-key-change-this-in-production-min-256-bits-long
```

## Running the Application

### 1. Build the Project

```bash
cd backend
mvn clean install
```

### 2. Run Database Migrations

Flyway will run automatically on application startup. It will:
- Create all tables with PostGIS columns
- Create spatial indexes
- Insert seed data (departments, categories, admin user)

### 3. Start the Application

**Development mode:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Production mode:**
```bash
java -jar target/india-local-problems-os-0.0.1-SNAPSHOT.jar
```

The application will start on `http://localhost:8080`

### 4. Verify Application

Check health:
```bash
curl http://localhost:8080/actuator/health
```

## Default Users

The seed data creates default users:

**Admin:**
- Email: `admin@localproblems.in`
- Password: `Admin@123`

**Officer:**
- Email: `officer.kumar@city.gov.in`
- Password: `Officer@123`

**⚠️ Change these passwords in production!**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new citizen
- `POST /api/auth/login` - Login

### Citizen
- `POST /api/issues` - Report new issue
- `GET /api/issues/nearby` - Find nearby issues
- `GET /api/issues/{id}` - Get issue details
- `POST /api/issues/{id}/support` - Support an issue
- `POST /api/issues/{id}/verify` - Verify resolution

### Officer
- `GET /api/officer/issues` - List assigned issues
- `PATCH /api/officer/issues/{id}/assign` - Assign issue
- `PATCH /api/officer/issues/{id}/status` - Update status
- `POST /api/officer/issues/{id}/evidence` - Upload evidence

### Admin
- `GET /api/admin/departments` - List departments
- `POST /api/admin/departments` - Create department
- `GET /api/admin/analytics` - View analytics

## Project Structure

```
src/main/java/com/localproblems/os/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── repository/     # Data access layer
├── service/        # Business logic
├── security/       # JWT authentication
├── exception/      # Exception handling
└── util/           # Utility classes

src/main/resources/
├── db/migration/   # Flyway SQL migrations
└── application.yml # Configuration
```

## Development

### Running Tests

```bash
mvn test
```

### Database Migrations

To create a new migration:
1. Create file: `src/main/resources/db/migration/V{version}__{description}.sql`
2. Example: `V3__add_notifications_table.sql`
3. Flyway will apply it on next startup

### Logging

Set log levels in `application.yml` or via environment variables:
- `LOG_LEVEL` - Application logs (default: INFO)
- `SQL_LOG_LEVEL` - SQL queries (default: WARN)
- `SECURITY_LOG_LEVEL` - Security logs (default: WARN)

## Troubleshooting

### PostGIS Not Found
If you get "type `geography` does not exist":
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Connection Refused
Check PostgreSQL is running:
```bash
sudo systemctl status postgresql  # Linux
brew services list                # macOS
```

### Flyway Errors
To reset database (⚠️ deletes all data):
```sql
DROP DATABASE local_problems_db;
CREATE DATABASE local_problems_db;
CREATE EXTENSION postgis;
```

## Next Steps

1. Implement JWT Security configuration
2. Create authentication service and controllers
3. Implement issue reporting service with duplicate detection
4. Add file upload functionality
5. Build citizen and officer workflows

## License

Proprietary - India Local Problems OS
