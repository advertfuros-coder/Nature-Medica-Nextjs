#!/bin/bash

# Nature Medica - Google Cloud Run Deployment Script
# This script builds and deploys your Next.js app to Google Cloud Run

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Nature Medica - Cloud Run Deployment ===${NC}\n"

# Configuration
PROJECT_ID="nature-medica-prod"  # Change this to your actual project ID
SERVICE_NAME="nature-medica"
REGION="europe-west1"  # Matches your screenshot (Belgium)
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

# Step 1: Check if gcloud is installed
echo -e "${YELLOW}Step 1: Checking gcloud CLI...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
echo -e "${GREEN}✓ gcloud CLI found${NC}\n"

# Step 2: Set project
echo -e "${YELLOW}Step 2: Setting Google Cloud project...${NC}"
gcloud config set project ${PROJECT_ID}
echo -e "${GREEN}✓ Project set to ${PROJECT_ID}${NC}\n"

# Step 3: Enable required APIs
echo -e "${YELLOW}Step 3: Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
echo -e "${GREEN}✓ APIs enabled${NC}\n"

# Step 4: Build Docker image
echo -e "${YELLOW}Step 4: Building Docker image...${NC}"
docker build -t ${IMAGE_NAME} .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully${NC}\n"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi

# Step 5: Authenticate Docker with GCR
echo -e "${YELLOW}Step 5: Authenticating Docker with Google Container Registry...${NC}"
gcloud auth configure-docker
echo -e "${GREEN}✓ Docker authenticated${NC}\n"

# Step 6: Push image to GCR
echo -e "${YELLOW}Step 6: Pushing image to Google Container Registry...${NC}"
docker push ${IMAGE_NAME}
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image pushed successfully${NC}\n"
else
    echo -e "${RED}✗ Image push failed${NC}"
    exit 1
fi

# Step 7: Deploy to Cloud Run
echo -e "${YELLOW}Step 7: Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0 \
  --timeout 300 \
  --port 3000

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Deployment successful!${NC}\n"
    echo -e "${GREEN}Your app is now live!${NC}"
    echo -e "View it at: ${YELLOW}$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)')${NC}\n"
else
    echo -e "${RED}✗ Deployment failed${NC}"
    exit 1
fi

# Step 8: Set environment variables (reminder)
echo -e "${YELLOW}⚠️  IMPORTANT: Set your environment variables${NC}"
echo "Go to: https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}/variables"
echo "Or run:"
echo -e "${YELLOW}gcloud run services update ${SERVICE_NAME} --update-env-vars KEY=VALUE --region ${REGION}${NC}\n"

echo -e "${GREEN}=== Deployment Complete ===${NC}"
