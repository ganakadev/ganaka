#!/bin/bash
set -e

# Restore test database from production using Neon API
# This script clones production data to the test database branch

echo "Starting database restore from production..."

# Validate required environment variables
if [ -z "$NEON_API_KEY" ]; then
  echo "Error: NEON_API_KEY environment variable is not set"
  exit 1
fi

if [ -z "$NEON_PROJECT_ID" ]; then
  echo "Error: NEON_PROJECT_ID environment variable is not set"
  exit 1
fi

if [ -z "$NEON_TEST_BRANCH_ID" ]; then
  echo "Error: NEON_TEST_BRANCH_ID environment variable is not set"
  exit 1
fi

if [ -z "$NEON_PRODUCTION_BRANCH_ID" ]; then
  echo "Error: NEON_PRODUCTION_BRANCH_ID environment variable is not set"
  exit 1
fi

echo "Project ID: $NEON_PROJECT_ID"
echo "Test Branch ID: $NEON_TEST_BRANCH_ID"
echo "Production Branch ID: $NEON_PRODUCTION_BRANCH_ID"

# Construct API URL
API_URL="https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/branches/${NEON_TEST_BRANCH_ID}/restore"

echo "Calling Neon API to restore database..."
echo "URL: $API_URL"

# Make API request and capture response
HTTP_CODE=$(curl -s -w "%{http_code}" -o /tmp/neon-restore-response.json \
  -X POST \
  -H "Authorization: Bearer ${NEON_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"source_branch_id\": \"${NEON_PRODUCTION_BRANCH_ID}\"}" \
  "$API_URL")

# Check HTTP status code
if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "Database restore initiated successfully (HTTP $HTTP_CODE)"
  cat /tmp/neon-restore-response.json
  echo ""
  
  # Wait a moment for the restore to process
  echo "Waiting for database restore to complete..."
  sleep 5
  
  echo "Database restore complete!"
else
  echo "Error: Database restore failed with HTTP status $HTTP_CODE"
  echo "Response:"
  cat /tmp/neon-restore-response.json
  echo ""
  exit 1
fi

# Cleanup
rm -f /tmp/neon-restore-response.json

