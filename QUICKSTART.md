# Quick Start: Deploy to Google Cloud

## 🚀 Fast Deployment (5 minutes)

### Prerequisites

```bash
# Install Google Cloud CLI
# Mac: brew install --cask google-cloud-sdk
# Windows/Linux: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login
```

### Option 1: Using Automated Script (Easiest)

```bash
# Make script executable (already done)
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

Follow the interactive prompts and you're done! ✅

### Option 2: Manual Deployment

```bash
# 1. Set your project
gcloud config set project YOUR_PROJECT_ID

# 2. Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# 3. Build image
docker build -t gcr.io/YOUR_PROJECT_ID/nature-medica:latest .

# 4. Push to Container Registry
gcloud auth configure-docker
docker push gcr.io/YOUR_PROJECT_ID/nature-medica:latest

# 5. Deploy to Cloud Run
gcloud run deploy nature-medica \
  --image gcr.io/YOUR_PROJECT_ID/nature-medica:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi
```

### Set Environment Variables

After deployment, set your environment variables:

```bash
gcloud run services update nature-medica \
  --region us-central1 \
  --update-env-vars \
  MONGODB_URI="your_uri",\
NEXTAUTH_SECRET="your_secret",\
NEXTAUTH_URL="https://your-url.run.app"
```

## 📝 Important Files Created

- **Dockerfile** - Multi-stage production build
- **docker-compose.yml** - Local testing
- **cloudbuild.yaml** - CI/CD automation
- **.dockerignore** - Optimize build context
- **.gcloudignore** - Optimize deployments
- **next.config.js** - Standalone output enabled
- **deploy.sh** - Automated deployment script
- **DEPLOYMENT.md** - Detailed guide

## 🧪 Test Locally First

```bash
# Build locally
docker build -t nature-medica:test .

# Run with env file
docker run -p 3000:3000 --env-file .env.local nature-medica:test

# Or use docker-compose
docker-compose up
```

Visit http://localhost:3000 to test!

## 🔐 Environment Variables

Copy `env.production.example` to `.env.production` and fill in your values:

```bash
cp env.production.example .env.production
# Edit .env.production with your actual values
```

## 📊 Monitor Your Application

```bash
# View logs
gcloud run services logs tail nature-medica --region=us-central1

# Check status
gcloud run services describe nature-medica --region=us-central1
```

## 💰 Cost Estimate

Google Cloud Run pricing (approximate):

- **First 2 million requests**: FREE
- **Beyond that**: ~$0.40 per million requests
- **Memory/CPU**: ~$0.00002448 per GB-second

**Estimated monthly cost for moderate traffic**: $5-20/month

## 🆘 Troubleshooting

### Build fails?

- Check `next.config.js` has `output: 'standalone'`
- Verify all dependencies in `package.json`
- Check Docker is running

### Deployment fails?

- Verify Google Cloud project is set correctly
- Check billing is enabled on your project
- Ensure APIs are enabled

### App crashes?

- Check environment variables are set
- Verify MongoDB URI is accessible
- Check logs: `gcloud run services logs tail nature-medica`

## 📚 Need More Help?

See `DEPLOYMENT.md` for:

- Detailed step-by-step instructions
- GKE deployment option
- CI/CD setup
- Custom domain configuration
- Security best practices

## 🎉 You're Ready!

Your Nature Medica app is now deployed and ready to serve customers! 🌿
