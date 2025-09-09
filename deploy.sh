#!/bin/bash

# FamilyLink Production Deployment Script
set -e

echo "🚀 Starting FamilyLink deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"

# Create backup directory
mkdir -p $BACKUP_DIR

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

# Check if required files exist
required_files=("docker-compose.yml" "nginx.conf" "backend/Dockerfile" "frontend/Dockerfile")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file $file not found"
        exit 1
    fi
done

print_status "All required files found"

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_warning "Creating .env file from template"
    cat > .env << EOF
# Database
DB_PASSWORD=familylink_secure_$(openssl rand -hex 16)

# Django
SECRET_KEY=$(openssl rand -hex 32)
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,familylink.app,www.familylink.app

# Redis
REDIS_URL=redis://redis:6379/0

# Firebase (Add your credentials)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# OpenAI (Optional)
OPENAI_API_KEY=your-openai-key

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EOF
    print_warning "Please update .env file with your actual credentials before continuing"
    read -p "Press Enter to continue after updating .env file..."
fi

# Backup existing data if containers are running
if docker-compose ps | grep -q "Up"; then
    print_status "Creating backup of existing data..."
    
    # Backup database
    docker-compose exec -T db pg_dump -U postgres familylink > "$BACKUP_DIR/database.sql" || true
    
    # Backup media files
    docker-compose exec -T backend tar -czf - /app/media > "$BACKUP_DIR/media.tar.gz" || true
    
    print_status "Backup created in $BACKUP_DIR"
fi

# Pull latest images
print_status "Pulling latest Docker images..."
docker-compose pull

# Build custom images
print_status "Building application images..."
docker-compose build --no-cache

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Start services
print_status "Starting services..."
docker-compose up -d

# Wait for services to be healthy
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
services=("db" "redis" "backend" "frontend" "nginx")
for service in "${services[@]}"; do
    if docker-compose ps $service | grep -q "Up"; then
        print_status "$service is running"
    else
        print_error "$service failed to start"
        docker-compose logs $service
        exit 1
    fi
done

# Run database migrations
print_status "Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Create superuser if it doesn't exist
print_status "Setting up admin user..."
docker-compose exec -T backend python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@familylink.app').exists():
    User.objects.create_superuser(
        email='admin@familylink.app',
        phone_number='+1234567890',
        full_name='Admin User',
        password='admin123'
    )
    print('Admin user created: admin@familylink.app / admin123')
else:
    print('Admin user already exists')
EOF

# Collect static files
print_status "Collecting static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput

# Test application endpoints
print_status "Testing application endpoints..."

# Test backend API
if curl -f http://localhost:8000/api/ > /dev/null 2>&1; then
    print_status "Backend API is responding"
else
    print_error "Backend API is not responding"
fi

# Test frontend
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    print_status "Frontend is responding"
else
    print_error "Frontend is not responding"
fi

# Test Nginx
if curl -f http://localhost/ > /dev/null 2>&1; then
    print_status "Nginx is responding"
else
    print_error "Nginx is not responding"
fi

# Show running containers
print_status "Deployment completed! Running containers:"
docker-compose ps

echo ""
echo -e "${GREEN}🎉 FamilyLink has been successfully deployed!${NC}"
echo ""
echo -e "${BLUE}📱 Application URLs:${NC}"
echo "   Frontend: http://localhost"
echo "   API: http://localhost/api/"
echo "   Admin: http://localhost/admin/"
echo ""
echo -e "${BLUE}🔐 Admin Credentials:${NC}"
echo "   Email: admin@familylink.app"
echo "   Password: admin123"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "   1. Change the admin password immediately"
echo "   2. Update .env file with production credentials"
echo "   3. Set up SSL certificates for HTTPS"
echo "   4. Configure your domain DNS"
echo ""
echo -e "${BLUE}📊 Monitoring:${NC}"
echo "   View logs: docker-compose logs -f"
echo "   Check status: docker-compose ps"
echo "   Stop services: docker-compose down"
echo ""

# Save deployment info
cat > deployment_info.txt << EOF
FamilyLink Deployment Information
================================
Deployment Date: $(date)
Environment: $ENVIRONMENT
Backup Location: $BACKUP_DIR

URLs:
- Frontend: http://localhost
- API: http://localhost/api/
- Admin: http://localhost/admin/

Admin Credentials:
- Email: admin@familylink.app
- Password: admin123 (CHANGE IMMEDIATELY)

Commands:
- View logs: docker-compose logs -f
- Check status: docker-compose ps
- Stop services: docker-compose down
- Restart: docker-compose restart
EOF

print_status "Deployment information saved to deployment_info.txt"