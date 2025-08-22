#!/bin/bash

set -e

echo "🚀 Deploying Army COP Backend to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if we're connected to a cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Not connected to a Kubernetes cluster"
    exit 1
fi

# Build all Docker images
echo "📦 Building Docker images..."
./build-all.sh

# Apply Kubernetes manifests
echo "🔧 Applying Kubernetes manifests..."

# Create namespace and basic resources
kubectl apply -f k8s/namespace.yaml

# Deploy database
kubectl apply -f k8s/postgres.yaml

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n army-cop --timeout=300s

# Deploy services
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/ops-service.yaml
kubectl apply -f k8s/task-service.yaml
kubectl apply -f k8s/report-service.yaml
kubectl apply -f k8s/message-service.yaml
kubectl apply -f k8s/replay-service.yaml

# Deploy ingress
kubectl apply -f k8s/ingress.yaml

# Wait for deployments to be ready
echo "⏳ Waiting for services to be ready..."
kubectl wait --for=condition=available deployment --all -n army-cop --timeout=600s

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Service Status:"
kubectl get pods -n army-cop
echo ""
echo "🌐 Access the API at: http://army-cop-api.local"
echo "📚 API Documentation: http://army-cop-api.local/swagger-ui.html"
