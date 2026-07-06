#!/bin/bash

# RELAC 2026 Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Starting RELAC 2026 deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before running this script again.${NC}"
    exit 1
fi

# Build and start services
echo -e "${GREEN}📦 Building Docker images...${NC}"
docker-compose build

echo -e "${GREEN}🔄 Starting services...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${GREEN}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Run database migrations
echo -e "${GREEN}🗄️  Running database migrations...${NC}"
docker-compose exec backend npm run migrate

# Check service status
echo -e "${GREEN}📊 Checking service status...${NC}"
docker-compose ps

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost${NC}"
echo -e "${GREEN}🔧 Backend API: http://localhost:5000${NC}"
echo -e "${GREEN}📊 PostgreSQL: localhost:5432${NC}"
echo ""
echo -e "${YELLOW}To view logs: docker-compose logs -f${NC}"
echo -e "${YELLOW}To stop services: docker-compose down${NC}"
echo -e "${YELLOW}To restart services: docker-compose restart${NC}"
