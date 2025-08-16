#!/bin/bash
# Quick deployment script

echo "Starting UK Customer Intelligence Platform..."

# Build and start containers
docker-compose up -d --build

echo "Waiting for services to start..."
sleep 30

# Initialize database
echo "Initializing database..."
docker exec -i uk-intel-db psql -U devuser -d uk_customer_intelligence < database/init.sql

echo "Deployment complete!"
echo ""
echo "Access the platform:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Check logs with: docker-compose logs -f"
