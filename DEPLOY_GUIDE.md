# Deploy to Google Cloud Run - Quick Guide

## Method 1: Using the Cloud Console UI (What you're currently doing)

### Step-by-Step Instructions:

1. **Container Image URL**
   - You need to first push your Docker image to Google Container Registry
   - The URL format should be: `gcr.io/YOUR-PROJECT-ID/nature-medica:latest`
2. **How to Get Your Container Image**:

   ```bash
   # First, build your Docker image
   docker build -t gcr.io/YOUR-PROJECT-ID/nature-medica:latest .

   # Authenticate Docker with Google Container Registry
   gcloud auth configure-docker

   # Push the image
   docker push gcr.io/YOUR-PROJECT-ID/nature-medica:latest
   ```

3. **In the Cloud Console**:

   - ✅ You've already selected "Deploy one revision from an existing container image"
   - Enter your container image URL: `gcr.io/YOUR-PROJECT-ID/nature-medica:latest`
   - Click "SELECT" button
   - Service name: `nature-medica` (or your preferred name)
   - Region: `europe-west1 (Belgium)` - Already selected ✓
   - Click "CREATE" at the bottom

4. **After Creation**:
   - Go to "Variables & Secrets" tab
   - Add all your environment variables from `.env.local`
   - Deploy the new revision

---

## Method 2: Using Command Line (Faster & Automated)

### Quick Deploy (One Command):

```bash
# Make the deploy script executable
chmod +x deploy-to-cloud-run.sh

# Edit the script to set your PROJECT_ID
# Then run:
./deploy-to-cloud-run.sh
```

### Manual Commands:

```bash
# 1. Set your project ID
export PROJECT_ID="nature-medica-prod"  # Change to your actual project ID
export REGION="europe-west1"

# 2. Build the image
docker build -t gcr.io/${PROJECT_ID}/nature-medica:latest .

# 3. Authenticate and push
gcloud auth configure-docker
docker push gcr.io/${PROJECT_ID}/nature-medica:latest

# 4. Deploy to Cloud Run
gcloud run deploy nature-medica \
  --image gcr.io/${PROJECT_ID}/nature-medica:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --timeout 300 \
  --port 3000
```

---

## Environment Variables to Set

After deployment, you MUST set these environment variables:

### Required Variables:

- `NODE_ENV=production`
- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - Your NextAuth secret
- `NEXTAUTH_URL` - Your Cloud Run URL (will be provided after first deploy)
- `CLOUDINARY_CLOUD_NAME` - From your .env.local
- `CLOUDINARY_API_KEY` - From your .env.local
- `CLOUDINARY_API_SECRET` - From your .env.local
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - From your .env.local

### Copy all variables from your .env.local:

```bash
# Use this command to set env vars via CLI
gcloud run services update nature-medica \
  --update-env-vars "MONGODB_URI=your_value,NEXTAUTH_SECRET=your_value" \
  --region europe-west1
```

Or use the Cloud Console:

1. Go to Cloud Run > nature-medica service
2. Click "Edit & Deploy New Revision"
3. Go to "Variables & Secrets" tab
4. Add each environment variable
5. Click "Deploy"

---

## What's Your Current Project ID?

To find your project ID:

```bash
gcloud projects list
```

Or check in Cloud Console at the top navigation bar.

---

## Troubleshooting

### "Image not found" error:

- Make sure you've pushed the image to GCR first
- Verify the image URL format: `gcr.io/PROJECT-ID/IMAGE-NAME:TAG`

### Build fails:

- Check your Dockerfile exists in the project root
- Ensure all dependencies are in package.json

### Deployment succeeds but app crashes:

- Check environment variables are set correctly
- View logs: Cloud Console > Cloud Run > your-service > Logs tab
