# Docker Compose Local Development Guide

This guide explains how to run the Malayalees US Site backend services locally using Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0 or higher
- At least 4GB RAM available for Docker
- Ports 5432, 6379, and 8080 available on your machine

## Quick Start

### 1. Environment Setup (Optional)

Copy the environment example file and customize it if you want to override defaults:

```bash
cd src/main/docker/Docker_Local
cp env.example .env
```

Edit the `.env` file with your preferred values (optional - defaults work fine):

```bash
# JWT API Authentication Variables (for when you add backend service)
JWT_API_AUTH_USERNAME=your_admin_username
JWT_API_AUTH_PASSWORD=your_secure_password

# Database Configuration (optional - defaults are set)
POSTGRES_USER=malayalees_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=malayalees_db
```

### 2. Start Services

Start all services in detached mode:

```bash
docker-compose -f docker-compose.local.yml up -d
```

Or start with logs visible:

```bash
docker-compose -f docker-compose.local.yml up
```

### 3. Verify Services

Check if all services are running:

```bash
docker-compose -f docker-compose.local.yml ps
```

Expected output:
```
NAME                  IMAGE            COMMAND                  SERVICE      CREATED         STATUS                   PORTS
malayalees_postgres   postgres:16.0    "docker-entrypoint.s…"   postgresql   8 seconds ago   Up 7 seconds (healthy)   127.0.0.1:5432->5432/tcp
malayalees_redis      redis:7-alpine   "docker-entrypoint.s…"   redis        8 seconds ago   Up 8 seconds             127.0.0.1:6379->6379/tcp
```

## Service Details

### PostgreSQL Database
- **Port**: 5432
- **Database**: malayalees_db
- **Username**: malayalees_user
- **Password**: malayalees_password (or from .env)
- **Health Check**: Automatic with 5-second intervals
- **Connection String**: `postgresql://malayalees_user:malayalees_password@localhost:5432/malayalees_db`

### Redis Cache
- **Port**: 6379
- **Purpose**: Caching and session storage
- **Data Persistence**: Volume-mounted storage
- **Connection String**: `redis://localhost:6379`

### Backend API Service (Commented Out)
- **Status**: Currently commented out in docker-compose.local.yml
- **Reason**: This is a Next.js frontend project - backend service should be added separately
- **JWT Variables**: Available in env.example for when you add your backend service
- **To Enable**: Uncomment the backend-api section in docker-compose.local.yml and provide your backend image

## Common Commands

### Start Services
```bash
# Start all services
docker-compose -f docker-compose.local.yml up -d

# Start specific service
docker-compose -f docker-compose.local.yml up -d postgresql
```

### Stop Services
```bash
# Stop all services
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose -f docker-compose.local.yml down -v
```

### View Logs
```bash
# View all logs
docker-compose -f docker-compose.local.yml logs

# View specific service logs
docker-compose -f docker-compose.local.yml logs backend-api

# Follow logs in real-time
docker-compose -f docker-compose.local.yml logs -f backend-api
```

### Restart Services
```bash
# Restart all services
docker-compose -f docker-compose.local.yml restart

# Restart specific service
docker-compose -f docker-compose.local.yml restart backend-api
```

### Database Operations
```bash
# Connect to PostgreSQL
docker-compose -f docker-compose.local.yml exec postgresql psql -U malayalees_user -d malayalees_db

# Backup database
docker-compose -f docker-compose.local.yml exec postgresql pg_dump -U malayalees_user malayalees_db > backup.sql

# Restore database
docker-compose -f docker-compose.local.yml exec -T postgresql psql -U malayalees_user -d malayalees_db < backup.sql
```

## Environment Variables

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `JWT_API_AUTH_USERNAME` | Username for JWT API authentication | `admin` | `myadmin` |
| `JWT_API_AUTH_PASSWORD` | Password for JWT API authentication | `admin123` | `securepassword123` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `malayalees_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `malayalees_password` |
| `POSTGRES_DB` | PostgreSQL database name | `malayalees_db` |
| `SPRING_PROFILES_ACTIVE` | Spring Boot profile | `dev` |
| `SERVER_PORT` | Backend API port | `8080` |

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :8080

   # Kill the process or change the port in docker-compose.local.yml
   ```

2. **Database Connection Failed**
   ```bash
   # Check PostgreSQL logs
   docker-compose -f docker-compose.local.yml logs postgresql

   # Verify database is healthy
   docker-compose -f docker-compose.local.yml exec postgresql pg_isready -U malayalees_user
   ```

3. **Backend API Not Starting**
   ```bash
   # Check backend logs
   docker-compose -f docker-compose.local.yml logs backend-api

   # Verify JWT credentials are set
   docker-compose -f docker-compose.local.yml exec backend-api env | grep JWT
   ```

4. **Permission Issues**
   ```bash
   # Fix volume permissions
   sudo chown -R $USER:$USER ./logs
   ```

### Health Checks

Monitor service health:

```bash
# Check service health
docker-compose -f docker-compose.local.yml ps

# Detailed health check
docker inspect malayalees_postgres | grep -A 10 Health
```

### Clean Up

Remove everything (including volumes):

```bash
# Stop and remove containers, networks, and volumes
docker-compose -f docker-compose.local.yml down -v

# Remove images
docker-compose -f docker-compose.local.yml down --rmi all

# Clean up unused Docker resources
docker system prune -a
```

## Development Workflow

### 1. Initial Setup
```bash
# Clone repository and navigate to Docker directory
cd src/main/docker/Docker_Local

# Copy and configure environment
cp env.example .env
# Edit .env with your values

# Start services
docker-compose -f docker-compose.local.yml up -d
```

### 2. Daily Development
```bash
# Start services
docker-compose -f docker-compose.local.yml up -d

# View logs
docker-compose -f docker-compose.local.yml logs -f backend-api

# Stop when done
docker-compose -f docker-compose.local.yml down
```

### 3. Database Changes
```bash
# Connect to database
docker-compose -f docker-compose.local.yml exec postgresql psql -U malayalees_user -d malayalees_db

# Run migrations or SQL scripts
# ... your SQL commands ...
```

## Security Notes

⚠️ **Important**: This configuration is for **development only**. For production:

1. Change all default passwords
2. Use Docker secrets for sensitive data
3. Enable SSL/TLS for database connections
4. Restrict network access
5. Use proper firewall rules
6. Regular security updates

## Support

If you encounter issues:

1. Check the logs: `docker-compose -f docker-compose.local.yml logs`
2. Verify environment variables: `docker-compose -f docker-compose.local.yml config`
3. Ensure Docker Desktop is running
4. Check available disk space and memory
5. Verify ports are not in use by other services

For additional help, refer to the main project documentation or contact the development team.
