#!/bin/bash

# Simple deployment guide for Nature Medica
# Run this after installing Docker and gcloud CLI

echo "=== Nature Medica Deployment Helper ==="
echo ""
echo "Prerequisites Check:"
echo "✓ Docker installed? (docker --version)"
echo "✓ gcloud CLI installed? (Download from: https://cloud.google.com/sdk/docs/install)"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop first:"
    echo "   https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker found: $(docker --version)"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found."
    echo ""
    echo "Please install gcloud CLI:"
    echo "  Mac: brew install --cask google-cloud-sdk"
    echo "  Or download from: https://cloud.google.com/sdk/docs/install"
    echo ""
    exit 1
fi

echo "✅ gcloud found: $(gcloud --version | head -1)"
echo ""

# Get project ID
echo "Available Google Cloud Projects:"
gcloud projects list
echo ""

read -p "Enter your Google Cloud Project ID: " PROJECT_ID
read -p "Enter your preferred region (default: europe-west1): " REGION
REGION=${REGION:-europe-west1}

echo ""
echo "Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Image: gcr.io/$PROJECT_ID/nature-medica:latest"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Set project
echo "Setting project..."
gcloud config set project $PROJECT_ID

# Enable APIs
echo "Enabling required APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com

# Build image
echo "Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/nature-medica:latest .

# Configure Docker
echo "Configuring Docker authentication..."
gcloud auth configure-docker

# Push image
echo "Pushing image to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/nature-medica:latest

# Deploy
echo "Deploying to Cloud Run..."
gcloud run deploy nature-medica \
  --image gcr.io/$PROJECT_ID/nature-medica:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --port 3000

echo ""
echo "✅ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: Set environment variables in Cloud Console:"
echo "   https://console.cloud.google.com/run/detail/$REGION/nature-medica/variables"
echo ""
echo "Your app URL:"
gcloud run services describe nature-medica --region=$REGION --format='value(status.url)'
