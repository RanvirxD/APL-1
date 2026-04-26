#!/bin/bash
set -e

PROJECT_ID="apl-1"
REGION="asia-south1"

echo "Deploying backend..."
cd backend
gcloud run deploy arenaiq-backend \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --port 3001 \
  --project $PROJECT_ID
cd ..

echo "Backend deployed."
echo "Now deploying frontend..."
cd frontend
gcloud run deploy arenaiq-frontend \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000 \
  --project $PROJECT_ID
cd ..

echo "Both services deployed successfully."
