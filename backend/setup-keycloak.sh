#!/bin/bash

echo "Setting up Keycloak for Army COP..."

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to start..."
until curl -f http://localhost:8080/health/ready; do
    echo "Waiting for Keycloak..."
    sleep 5
done

echo "Keycloak is ready!"

# The realm will be automatically imported via the mounted volume
# Additional setup can be done here if needed

echo "Keycloak setup complete!"
echo "Access Keycloak Admin Console: http://localhost:8080"
echo "Username: admin"
echo "Password: admin"
echo ""
echo "Test users:"
echo "- admin/admin123 (HQ role)"
echo "- unit1/unit123 (UNIT role)"  
echo "- observer1/observer123 (OBSERVER role)"
