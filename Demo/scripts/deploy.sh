#!/bin/bash

# Full-Stack Todo Application Deployment Script
# This script builds and prepares the application for production deployment

set -e  # Exit on any error

echo "🚀 Deploying Full-Stack Todo Application..."
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
DEPLOY_DIR="./deploy"
BACKEND_PUBLISH_DIR="$DEPLOY_DIR/backend"
FRONTEND_DIST_DIR="$DEPLOY_DIR/frontend"

# Clean previous deployment
clean_deploy_dir() {
    print_status "Cleaning previous deployment..."
    
    if [ -d "$DEPLOY_DIR" ]; then
        rm -rf "$DEPLOY_DIR"
    fi
    
    mkdir -p "$DEPLOY_DIR"
    mkdir -p "$BACKEND_PUBLISH_DIR"
    mkdir -p "$FRONTEND_DIST_DIR"
    
    print_success "Deploy directory cleaned ✓"
}

# Build backend for production
build_backend() {
    print_status "Building backend for production..."
    
    cd backend
    
    # Clean previous builds
    dotnet clean --configuration Release
    
    # Restore packages
    print_status "Restoring .NET packages..."
    dotnet restore
    
    # Publish for production
    print_status "Publishing .NET application..."
    dotnet publish --configuration Release --output "../$BACKEND_PUBLISH_DIR" --no-restore
    
    print_success "Backend build completed ✓"
    cd ..
}

# Build frontend for production
build_frontend() {
    print_status "Building frontend for production..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing npm dependencies..."
    npm ci --only=production
    
    # Build for production
    print_status "Building React application..."
    npm run build
    
    # Copy build output
    cp -r dist/* "../$FRONTEND_DIST_DIR/"
    
    print_success "Frontend build completed ✓"
    cd ..
}

# Create deployment configuration
create_deployment_config() {
    print_status "Creating deployment configuration..."
    
    # Create production appsettings
    cat > "$BACKEND_PUBLISH_DIR/appsettings.Production.json" << EOF
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=todos.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://0.0.0.0:5000"
      }
    }
  }
}
EOF

    # Create startup script for backend
    cat > "$BACKEND_PUBLISH_DIR/start.sh" << 'EOF'
#!/bin/bash
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS=http://0.0.0.0:5000
./TodoApp.WebAPI
EOF
    chmod +x "$BACKEND_PUBLISH_DIR/start.sh"
    
    # Create nginx configuration for frontend
    cat > "$FRONTEND_DIST_DIR/nginx.conf" << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (adjust backend URL as needed)
    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
EOF

    print_success "Deployment configuration created ✓"
}

# Create Docker configuration
create_docker_config() {
    print_status "Creating Docker configuration..."
    
    # Backend Dockerfile
    cat > "$BACKEND_PUBLISH_DIR/Dockerfile" << 'EOF'
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY . .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["./TodoApp.WebAPI"]
EOF

    # Frontend Dockerfile
    cat > "$FRONTEND_DIST_DIR/Dockerfile" << 'EOF'
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

    # Docker Compose
    cat > "$DEPLOY_DIR/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: todo-backend
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:5000
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: todo-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  data:
EOF

    print_success "Docker configuration created ✓"
}

# Create deployment documentation
create_deployment_docs() {
    print_status "Creating deployment documentation..."
    
    cat > "$DEPLOY_DIR/DEPLOYMENT.md" << 'EOF'
# Deployment Guide

This directory contains the production-ready build of the Full-Stack Todo Application.

## Directory Structure

```
deploy/
├── backend/           # .NET published application
├── frontend/          # React production build
├── docker-compose.yml # Docker deployment configuration
└── DEPLOYMENT.md      # This file
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

1. **Prerequisites**: Docker and Docker Compose installed

2. **Deploy with Docker Compose**:
   ```bash
   cd deploy
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000/api
   - Swagger UI: http://localhost:5000/swagger

### Option 2: Manual Deployment

#### Backend Deployment

1. **Prerequisites**: .NET 9 runtime installed

2. **Run the backend**:
   ```bash
   cd deploy/backend
   ./start.sh
   ```

#### Frontend Deployment

1. **Prerequisites**: Web server (nginx, Apache, etc.)

2. **Serve static files**:
   - Copy contents of `deploy/frontend/` to your web server root
   - Configure your web server to handle client-side routing
   - Use the provided `nginx.conf` as reference

### Option 3: Cloud Deployment

#### Azure App Service
- Backend: Deploy as .NET Web App
- Frontend: Deploy as Static Web App

#### AWS
- Backend: Deploy to Elastic Beanstalk or ECS
- Frontend: Deploy to S3 + CloudFront

#### Heroku
- Backend: Deploy as .NET application
- Frontend: Deploy as static site

## Environment Variables

### Backend
- `ASPNETCORE_ENVIRONMENT`: Set to "Production"
- `ASPNETCORE_URLS`: Set to "http://+:5000"
- `ConnectionStrings__DefaultConnection`: Database connection string

### Frontend
- API base URL is configured at build time
- Update `src/services/api.ts` before building if needed

## Database

The application uses SQLite by default. For production:
- Consider PostgreSQL or SQL Server for better performance
- Update connection string in `appsettings.Production.json`
- Run database migrations if needed

## Security Considerations

- Use HTTPS in production
- Configure proper CORS settings
- Set up authentication if required
- Use environment variables for sensitive data
- Regular security updates

## Monitoring

- Check application logs
- Monitor API response times
- Set up health checks
- Monitor database performance

## Backup

- Regular database backups
- Application configuration backups
- Static file backups

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 80 and 5000 are available
2. **Database permissions**: Check file permissions for SQLite
3. **CORS errors**: Verify frontend/backend URL configuration
4. **Memory issues**: Monitor container resource usage

### Logs
- Backend logs: Check application output
- Frontend logs: Check browser console
- Docker logs: `docker-compose logs`

## Support

For deployment issues, refer to:
- Main project documentation
- Component-specific README files
- Docker documentation
- Cloud provider documentation
EOF

    print_success "Deployment documentation created ✓"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check backend files
    if [ -f "$BACKEND_PUBLISH_DIR/TodoApp.WebAPI" ] || [ -f "$BACKEND_PUBLISH_DIR/TodoApp.WebAPI.exe" ]; then
        print_success "Backend executable found ✓"
    else
        print_error "Backend executable not found ✗"
        exit 1
    fi
    
    # Check frontend files
    if [ -f "$FRONTEND_DIST_DIR/index.html" ]; then
        print_success "Frontend index.html found ✓"
    else
        print_error "Frontend index.html not found ✗"
        exit 1
    fi
    
    # Check Docker files
    if [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
        print_success "Docker configuration found ✓"
    else
        print_error "Docker configuration not found ✗"
        exit 1
    fi
}

# Main deployment process
main() {
    echo "Starting deployment process..."
    echo
    
    clean_deploy_dir
    echo
    
    build_backend
    echo
    
    build_frontend
    echo
    
    create_deployment_config
    echo
    
    create_docker_config
    echo
    
    create_deployment_docs
    echo
    
    verify_deployment
    echo
    
    print_success "🎉 Deployment completed successfully!"
    echo
    echo "Deployment artifacts created in: $DEPLOY_DIR"
    echo
    echo "Next steps:"
    echo "1. Review deployment configuration"
    echo "2. Test deployment locally: cd $DEPLOY_DIR && docker-compose up"
    echo "3. Deploy to your production environment"
    echo
    echo "For detailed deployment instructions, see $DEPLOY_DIR/DEPLOYMENT.md"
}

# Run main function
main "$@"