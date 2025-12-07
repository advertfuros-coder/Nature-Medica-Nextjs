# Deployment Guide: Nature Medica to Google Cloud

This guide will help you deploy the Nature Medica Next.js application to Google Cloud Platform.

## Prerequisites

1. **Google Cloud Account**: Sign up at https://cloud.google.com
2. **gcloud CLI**: Install from https://cloud.google.com/sdk/docs/install
3. **Docker**: Install from https://www.docker.com/products/docker-desktop
4. **Project Setup**: Have your environment variables ready

## Deployment Options

### Option 1: Google Cloud Run (Recommended for Quick Deployment)

Cloud Run is serverless, scales automatically, and is cost-effective.

#### Step 1: Initialize Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create nature-medica-prod --name="Nature Medica Production"

# Set the project
gcloud config set project nature-medica-prod

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### Step 2: Set Environment Variables

Create a `.env.production` file with your production environment variables:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-app-url.run.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# Add all other environment variables
```

#### Step 3: Build and Deploy

```bash
# Build the Docker image
docker build -t gcr.io/nature-medica-prod/nature-medica:latest .

# Authenticate Docker with GCR
gcloud auth configure-docker

# Push the image to Google Container Registry
docker push gcr.io/nature-medica-prod/nature-medica:latest

# Deploy to Cloud Run
gcloud run deploy nature-medica \
  --image gcr.io/nature-medica-prod/nature-medica:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --timeout 300
```

#### Step 4: Set Environment Variables in Cloud Run

```bash
# Set environment variables (replace with your actual values)
gcloud run services update nature-medica \
  --update-env-vars \
  MONGODB_URI="your_mongodb_uri",\
NEXTAUTH_SECRET="your_secret",\
NEXTAUTH_URL="https://your-app-url.run.app",\
CLOUDINARY_CLOUD_NAME="your_cloudinary_name" \
  --region us-central1
```

Or use the Google Cloud Console:
1. Go to Cloud Run
2. Select your service
3. Click "Edit & Deploy New Revision"
4. Add environment variables in the "Variables & Secrets" tab

### Option 2: Google Kubernetes Engine (GKE)

For more control and advanced scaling.

#### Step 1: Create GKE Cluster

```bash
# Create a cluster
gcloud container clusters create nature-medica-cluster \
  --num-nodes=3 \
  --zone=us-central1-a \
  --machine-type=e2-medium

# Get credentials
gcloud container clusters get-credentials nature-medica-cluster --zone=us-central1-a
```

#### Step 2: Deploy to GKE

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nature-medica
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nature-medica
  template:
    metadata:
      labels:
        app: nature-medica
    spec:
      containers:
      - name: nature-medica
        image: gcr.io/nature-medica-prod/nature-medica:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        # Add more env vars from ConfigMap/Secrets
---
apiVersion: v1
kind: Service
metadata:
  name: nature-medica-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: nature-medica
```

```bash
# Apply the deployment
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods
kubectl get services
```

### Option 3: Using Cloud Build for CI/CD

The `cloudbuild.yaml` file is already created. To use it:

```bash
# Connect your GitHub repository to Cloud Build
gcloud beta builds triggers create github \
  --repo-name=your-repo-name \
  --repo-owner=your-github-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml

# Manual build trigger
gcloud builds submit --config=cloudbuild.yaml .
```

## Local Testing with Docker

Before deploying, test locally:

```bash
# Build the Docker image
docker build -t nature-medica:local .

# Run the container
docker run -p 3000:3000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e NEXTAUTH_SECRET="your_secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  nature-medica:local

# Or use docker-compose
docker-compose up
```

## Environment Variables Checklist

Make sure to set these in Google Cloud:

- ✅ `NODE_ENV=production`
- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `NEXTAUTH_SECRET` - Secret for NextAuth
- ✅ `NEXTAUTH_URL` - Your production URL
- ✅ `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- ✅ `CLOUDINARY_API_KEY` - Cloudinary API key
- ✅ `CLOUDINARY_API_SECRET` - Cloudinary API secret
- ✅ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Public Cloudinary name
- ✅ All payment gateway credentials (Cashfree, Razorpay, PhonePe)
- ✅ Email service credentials

## Cost Optimization Tips

1. **Use Cloud Run** instead of GKE for lower traffic websites
2. **Set minimum instances to 0** for Cloud Run to scale to zero
3. **Use Cloud CDN** for static assets
4. **Optimize Docker image size** (already done with multi-stage build)
5. **Monitor usage** with Google Cloud Monitoring

## Monitoring and Logs

```bash
# View logs
gcloud run services logs read nature-medica --region=us-central1

# Stream logs
gcloud run services logs tail nature-medica --region=us-central1
```

## Custom Domain Setup

```bash
# Map a custom domain
gcloud run domain-mappings create \
  --service nature-medica \
  --domain www.yourdomain.com \
  --region us-central1
```

Then update your DNS records as instructed by Google Cloud.

## Troubleshooting

### Build Fails
- Check Dockerfile syntax
- Ensure all dependencies are in package.json
- Verify `.dockerignore` is not excluding necessary files

### Deployment Fails
- Check environment variables are set correctly
- Verify MongoDB connection string is accessible from Google Cloud
- Check Cloud Run logs for specific errors

### App Crashes
- Check memory limits (increase if needed)
- Verify all environment variables are set
- Check application logs in Cloud Console

## Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use Secret Manager** for sensitive data
3. **Enable HTTPS** (automatic with Cloud Run)
4. **Set up IAM roles** properly
5. **Regular security updates** - rebuild Docker images monthly

## Useful Commands

```bash
# List running services
gcloud run services list

# Delete a service
gcloud run services delete nature-medica --region=us-central1

# Update a service
gcloud run services update nature-medica --region=us-central1

# Describe a service
gcloud run services describe nature-medica --region=us-central1
```

## Support

For issues or questions:
- Google Cloud Documentation: https://cloud.google.com/run/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Docker Documentation: https://docs.docker.com

---

**Note**: Replace `nature-medica-prod` with your actual Google Cloud project ID throughout these commands.
