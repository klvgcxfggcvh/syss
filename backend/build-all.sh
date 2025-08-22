#!/bin/bash

echo "Building Army COP Backend Services..."

# Build shared module first
echo "Building shared module..."
cd shared && mvn clean install && cd ..

# Build all services
services=("auth-service" "ops-service" "cop-service" "task-service" "report-service" "message-service" "replay-service")

for service in "${services[@]}"; do
    echo "Building $service..."
    cd $service && mvn clean package -DskipTests && cd ..
done

echo "All services built successfully!"
