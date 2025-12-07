#!/bin/bash

# Nature Medica - Google Cloud Deployment Script
# This script automates the deployment process to Google Cloud Run

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Nature Medica - Google Cloud Deployment${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install it from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Get project ID
echo -e "${YELLOW}Enter your Google Cloud Project ID:${NC}"
read -r PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: Project ID cannot be empty${NC}"
    exit 1
fi

# Set project
echo -e "\n${YELLOW}Setting Google Cloud project...${NC}"
gcloud config set project "$PROJECT_ID"

# Get region
echo -e "\n${YELLOW}Enter deployment region (default: us-central1):${NC}"
read -r REGION
REGION=${REGION:-us-central1}

# Get service name
echo -e "\n${YELLOW}Enter service name (default: nature-medica):${NC}"
read -r SERVICE_NAME
SERVICE_NAME=${SERVICE_NAME:-nature-medica}

# Ask for deployment type
echo -e "\n${YELLOW}Select deployment type:${NC}"
echo "1) Build and deploy (recommended)"
echo "2) Deploy existing image"
echo "3) Just build (no deploy)"
read -r DEPLOY_TYPE

IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"

if [ "$DEPLOY_TYPE" = "1" ] || [ "$DEPLOY_TYPE" = "3" ]; then
    # Build Docker image
    echo -e "\n${GREEN}Building Docker image...${NC}"
    docker build -t "$IMAGE_NAME" .
    
    # Authenticate Docker with GCR
    echo -e "\n${GREEN}Authenticating Docker with Google Container Registry...${NC}"
    gcloud auth configure-docker --quiet
    
    # Push image to GCR
    echo -e "\n${GREEN}Pushing image to Google Container Registry...${NC}"
    docker push "$IMAGE_NAME"
fi

if [ "$DEPLOY_TYPE" = "3" ]; then
    echo -e "\n${GREEN}Build complete! Image: $IMAGE_NAME${NC}"
    exit 0
fi

if [ "$DEPLOY_TYPE" = "1" ] || [ "$DEPLOY_TYPE" = "2" ]; then
    # Deploy to Cloud Run
    echo -e "\n${GREEN}Deploying to Cloud Run...${NC}"
    
    gcloud run deploy "$SERVICE_NAME" \
        --image "$IMAGE_NAME" \
        --platform managed \
        --region "$REGION" \
        --allow-unauthenticated \
        --memory 1Gi \
        --cpu 1 \
        --max-instances 10 \
        --timeout 300 \
        --set-env-vars "NODE_ENV=production"
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)")
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}Deployment Successful!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "\n${GREEN}Service URL: ${SERVICE_URL}${NC}"
    echo -e "\n${YELLOW}Next Steps:${NC}"
    echo "1. Set your environment variables using the Cloud Console"
    echo "2. Update NEXTAUTH_URL to: $SERVICE_URL"
    echo "3. Test your application at: $SERVICE_URL"
    echo -e "\n${YELLOW}Set environment variables with:${NC}"
    echo "gcloud run services update $SERVICE_NAME --region=$REGION --update-env-vars KEY=VALUE"
    echo -e "\n${YELLOW}View logs with:${NC}"
    echo "gcloud run services logs tail $SERVICE_NAME --region=$REGION"
fi
