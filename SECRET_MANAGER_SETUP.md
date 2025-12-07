# Secret Manager Setup Guide

## Setup Google Cloud Secret Manager

Before deploying, you need to store your sensitive environment variables in Google Cloud Secret Manager.

### Step 1: Enable Secret Manager API

```bash
gcloud services enable secretmanager.googleapis.com
```

### Step 2: Create Secrets

```bash
# Create MongoDB URI secret
echo -n "your-mongodb-connection-string-here" | \
  gcloud secrets create mongodb-uri \
  --data-file=- \
  --replication-policy="automatic"

# Create NextAuth Secret
echo -n "your-nextauth-secret-here" | \
  gcloud secrets create nextauth-secret \
  --data-file=- \
  --replication-policy="automatic"

# Optional: Create other secrets
echo -n "your-cloudinary-api-secret" | \
  gcloud secrets create cloudinary-api-secret \
  --data-file=- \
  --replication-policy="automatic"
```

### Step 3: Grant Access to Cloud Build

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

# Grant Cloud Build service account access to secrets
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Also grant to Cloud Run service account (for runtime access)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 4: Verify Secrets

```bash
# List all secrets
gcloud secrets list

# View secret metadata
gcloud secrets describe mongodb-uri

# Access secret value (for verification)
gcloud secrets versions access latest --secret="mongodb-uri"
```

### Step 5: Update Substitution Variables

In`cloudbuild.yaml`, replace these values with your actual values:

```yaml
substitutions:
  _CLOUDINARY_CLOUD_NAME: "your-actual-cloudinary-name"
  _REGION: "us-central1" # or your preferred region
  _NEXTAUTH_URL: "https://your-actual-app-url.run.app"
```

## Environment Variables Checklist

### Secrets (Store in Secret Manager)

- ✅ `mongodb-uri` - Your MongoDB connection string
- ✅ `nextauth-secret` - Your NextAuth secret (min 32 characters)
- ⚪ `cloudinary-api-secret` - Cloudinary API secret (optional)
- ⚪ `cashfree-secret` - Cashfree secret key (optional)
- ⚪ `razorpay-secret` - Razorpay key secret (optional)

### Public Variables (In cloudbuild.yaml substitutions)

- ✅ `_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- ✅ `_REGION` - Deployment region
- ✅ `_NEXTAUTH_URL` - Your app URL

## Deploy with Cloud Build

After setting up secrets:

### Option 1: Using gcloud command

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_CLOUDINARY_CLOUD_NAME="your-name",_REGION="us-central1"
```

### Option 2: Set up GitHub trigger

```bash
gcloud beta builds triggers create github \
  --repo-name=your-repo-name \
  --repo-owner=your-github-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --substitutions _CLOUDINARY_CLOUD_NAME="your-name",_REGION="us-central1"
```

## Updating Secrets

To update a secret value:

```bash
# Create a new version
echo -n "new-mongodb-connection-string" | \
  gcloud secrets versions add mongodb-uri --data-file=-

# The latest version is automatically used
```

## Security Best Practices

1. **Never commit secrets to Git**
2. **Use least privilege** - Only grant necessary permissions
3. **Rotate secrets regularly** - Update secrets periodically
4. **Audit access** - Monitor who accesses secrets
5. **Use different secrets** for dev/staging/production

## Troubleshooting

### Permission Denied Errors

```bash
# Check if Cloud Build has access
gcloud secrets get-iam-policy mongodb-uri

# If not, add the binding again
gcloud secrets add-iam-policy-binding mongodb-uri \
  --member="serviceAccount:YOUR_PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Secret Not Found

```bash
# Verify secret exists
gcloud secrets list | grep mongodb-uri

# Create if missing
echo -n "your-value" | gcloud secrets create mongodb-uri --data-file=-
```

## Alternative: Using .env for Local Builds

For local Docker builds (not Cloud Build):

```bash
# Create .env.production
cp env.production.example .env.production

# Edit with your values
nano .env.production

# Build with env file
docker build --build-arg MONGODB_URI="$(grep MONGODB_URI .env.production | cut -d '=' -f2)" -t nature-medica:local .
```

---

**Ready to deploy?** Make sure all secrets are created and accessible, then run:

```bash
gcloud builds submit --config=cloudbuild.yaml
```
