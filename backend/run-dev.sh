#!/bin/bash

echo "Starting Army COP Backend in Development Mode..."

# Start infrastructure
docker compose up -d postgres keycloak

# Wait for services to be ready
echo "Waiting for PostgreSQL and Keycloak to start..."
sleep 30

# Run services locally
echo "Starting services..."
services=("auth-service" "ops-service" "cop-service" "task-service" "report-service" "message-service" "replay-service")

for service in "${services[@]}"; do
    echo "Starting $service on port 808${services[@]/$service}..."
    cd $service && mvn spring-boot:run &
    cd ..
done

echo "All services started! Check logs for any issues."
echo "Keycloak Admin: http://localhost:8080 (admin/admin)"
echo "Services running on ports 8081-8087"
