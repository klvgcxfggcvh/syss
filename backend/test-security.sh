#!/bin/bash

echo "Testing Army COP Security Integration..."

# Get access token from Keycloak
echo "Getting access token..."
TOKEN_RESPONSE=$(curl -s -X POST \
  http://localhost:8080/realms/army-cop/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=army-cop-frontend" \
  -d "client_secret=army-cop-frontend-secret" \
  -d "username=admin" \
  -d "password=admin123")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

if [ "$ACCESS_TOKEN" = "null" ]; then
    echo "Failed to get access token"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo "Access token obtained successfully"

# Test authenticated API calls
echo "Testing authenticated API calls..."

# Test auth service
echo "Testing auth service..."
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:8081/api/auth/users | jq '.[0].username'

# Test ops service
echo "Testing ops service..."
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:8082/api/ops/operations | jq '.[0].name'

# Test task service
echo "Testing task service..."
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:8084/api/tasks/operation/$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:8082/api/ops/operations | jq -r '.[0].id')" | jq '.[0].title'

echo "Security integration test complete!"
