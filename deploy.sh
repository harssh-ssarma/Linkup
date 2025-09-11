#!/bin/bash

# Production deployment script

echo "🚀 Starting Linkup deployment..."

# Pull latest code
git pull origin main

# Build and start services
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

echo "✅ Deployment completed successfully!"