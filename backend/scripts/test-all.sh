#!/bin/bash

set -e

echo "🧪 Running comprehensive test suite for Army COP Backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Start test containers
print_status "Starting test infrastructure..."
docker-compose -f docker-compose.test.yml up -d postgres keycloak

# Wait for services to be ready
print_status "Waiting for test infrastructure to be ready..."
sleep 30

# Run unit tests
print_status "Running unit tests..."
mvn clean test -B

# Run integration tests
print_status "Running integration tests..."
mvn verify -B -Dspring.profiles.active=test

# Run security tests
print_status "Running security tests..."
./test-security.sh

# Run API tests with Newman (if available)
if command -v newman &> /dev/null; then
    print_status "Running API tests with Newman..."
    newman run postman/Army-COP-API.postman_collection.json \
           -e postman/test-environment.json \
           --reporters cli,junit \
           --reporter-junit-export target/newman-results.xml
else
    print_warning "Newman not found, skipping API tests"
fi

# Run load tests with Artillery (if available)
if command -v artillery &> /dev/null; then
    print_status "Running load tests..."
    artillery run load-tests/basic-load-test.yml
else
    print_warning "Artillery not found, skipping load tests"
fi

# Generate test reports
print_status "Generating test reports..."
mvn jacoco:report

# Security scanning with OWASP Dependency Check
if command -v dependency-check &> /dev/null; then
    print_status "Running security dependency scan..."
    dependency-check --project "Army COP" --scan . --format ALL --out target/dependency-check-report
else
    print_warning "OWASP Dependency Check not found, skipping security scan"
fi

# Cleanup test containers
print_status "Cleaning up test infrastructure..."
docker-compose -f docker-compose.test.yml down

print_status "✅ All tests completed successfully!"

# Display test results summary
echo ""
echo "📊 Test Results Summary:"
echo "========================"
find . -name "TEST-*.xml" -exec echo "Unit Tests: {}" \;
find . -name "failsafe-reports" -type d -exec echo "Integration Tests: {}" \;
find . -name "jacoco.xml" -exec echo "Coverage Report: {}" \;
