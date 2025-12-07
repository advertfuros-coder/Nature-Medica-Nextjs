# Complete Google Cloud Deployment Guide for Nature Medica

## 🎯 What You'll Deploy

Your Next.js Nature Medica e-commerce app to Google Cloud Run (serverless, auto-scaling)

**Estimated Time**: 15-20 minutes  
**Cost**: ~$5-20/month (Free tier: First 2M requests/month)

---

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] Google Cloud account (sign up at https://cloud.google.com)
- [ ] gcloud CLI installed
- [ ] MongoDB connection string ready
- [ ] Billing enabled on Google Cloud project

---

## 📋 Step-by-Step Deployment

### **Step 1: Install Google Cloud CLI** (if not already installed)

**For Mac:**

```bash
brew install --cask google-cloud-sdk
```

**For Windows:**
Download from: https://cloud.google.com/sdk/docs/install

**For Linux:**

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Verify installation:**

```bash
gcloud --version
```

---

### **Step 2: Login to Google Cloud**

```bash
# Login with your Google account
gcloud auth login

# This will open a browser - sign in with your Google account
```

---

### **Step 3: Create a Google Cloud Project**

```bash
# Create new project (replace with your preferred name)
gcloud projects create nature-medica-prod --name="Nature Medica"

# Set as active project
gcloud config set project nature-medica-prod

# Enable billing (required - do this in Cloud Console)
# Go to: https://console.cloud.google.com/billing
# Link your project to a billing account
```

**Alternative**: Use existing project

```bash
# List your projects
gcloud projects list

# Set existing project
gcloud config set project YOUR_EXISTING_PROJECT_ID
```

---

### **Step 4: Enable Required APIs**

```bash
# Enable all necessary Google Cloud APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com \
  compute.googleapis.com

# This takes about 1-2 minutes
```

---

### **Step 5: Set Up Secret Manager**

**5.1: Store MongoDB URI**

```bash
# Replace YOUR_MONGODB_URI with your actual MongoDB connection string
echo -n "mongodb+srv://username:password@cluster.mongodb.net/dbname" | \
  gcloud secrets create mongodb-uri \
  --data-file=- \
  --replication-policy="automatic"

# Verify it was created
gcloud secrets describe mongodb-uri
```

**5.2: Store NextAuth Secret**

```bash
# Generate a random 32-character secret (or use your own)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Store it
echo -n "$NEXTAUTH_SECRET" | \
  gcloud secrets create nextauth-secret \
  --data-file=- \
  --replication-policy="automatic"

# Save this secret somewhere safe! You'll need it for environment variables
echo "Your NextAuth Secret: $NEXTAUTH_SECRET"
```

**5.3: Grant Permissions to Cloud Build**

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

echo "Your project number: $PROJECT_NUMBER"

# Grant Secret Manager access to Cloud Build
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant access to Cloud Run service account
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

echo "✅ Permissions granted!"
```

---

### **Step 6: Update Configuration Files**

**6.1: Update `cloudbuild.yaml`**

Open `/Users/harsh/Developer/Personal Projects/Nature Medica/my-app/cloudbuild.yaml`

Find the `substitutions` section (around line 74) and update:

```yaml
substitutions:
  _CLOUDINARY_CLOUD_NAME: "dq3l5xjgq" # ← Your actual Cloudinary cloud name
  _REGION: "us-central1" # ← Keep this or change to your preferred region
  _NEXTAUTH_URL: "https://nature-medica-us-central1.run.app" # ← Keep for now, update after first deploy
```

**Where to find your Cloudinary cloud name:**

1. Login to Cloudinary dashboard
2. Find it in the dashboard URL or settings

---

### **Step 7: Deploy to Google Cloud**

**Navigate to your project directory:**

```bash
cd "/Users/harsh/Developer/Personal Projects/Nature Medica/my-app"
```

**Submit the build:**

```bash
gcloud builds submit --config=cloudbuild.yaml
```

**What happens now:**

- ⏳ Building Docker image (5-10 minutes)
- ⏳ Pushing to Container Registry
- ⏳ Deploying to Cloud Run
- ⏳ Setting up auto-scaling

**You'll see output like:**

```
Step #0 - "Build": ...
Step #1 - "Push": ...
Step #2 - "Deploy": ...
```

**Wait for:** `SUCCESS` message

---

### **Step 8: Get Your App URL**

After successful deployment:

```bash
# Get the service URL
gcloud run services describe nature-medica \
  --region=us-central1 \
  --format="value(status.url)"
```

**You'll get something like:**

```
https://nature-medica-abc123-uc.a.run.app
```

**🎉 Your app is live!** Save this URL.

---

### **Step 9: Set Additional Environment Variables**

Now that your app is deployed, set the remaining environment variables:

```bash
# Set your actual app URL
APP_URL="https://nature-medica-abc123-uc.a.run.app"  # ← Replace with your actual URL

# Update Cloud Run service with all environment variables
gcloud run services update nature-medica \
  --region=us-central1 \
  --update-env-vars "\
NODE_ENV=production,\
NEXTAUTH_URL=$APP_URL,\
NEXT_PUBLIC_API_URL=$APP_URL/api,\
NEXT_PUBLIC_BASE_URL=$APP_URL"
```

**Add more environment variables as needed:**

```bash
gcloud run services update nature-medica \
  --region=us-central1 \
  --update-env-vars "\
EMAIL_HOST=smtp.gmail.com,\
EMAIL_PORT=587,\
EMAIL_USER=your-email@gmail.com,\
EMAIL_FROM=noreply@naturemedica.com"

# For secrets, use --update-secrets instead
gcloud run services update nature-medica \
  --region=us-central1 \
  --update-secrets="EMAIL_PASSWORD=email-password:latest"
```

---

### **Step 10: Update NextAuth URL in cloudbuild.yaml**

**Edit `cloudbuild.yaml` again:**

Replace the `_NEXTAUTH_URL` with your actual app URL:

```yaml
substitutions:
  _CLOUDINARY_CLOUD_NAME: "dq3l5xjgq"
  _REGION: "us-central1"
  _NEXTAUTH_URL: "https://nature-medica-abc123-uc.a.run.app" # ← Your actual URL
```

**This ensures future deployments use the correct URL.**

---

### **Step 11: Test Your Deployment**

**Visit your app:**

```bash
# Open in browser
open $(gcloud run services describe nature-medica --region=us-central1 --format="value(status.url)")
```

**Test checklist:**

- [ ] Homepage loads
- [ ] Products page works
- [ ] Can add to cart
- [ ] Login/signup works
- [ ] Admin panel accessible (if applicable)

---

### **Step 12: Set Up Custom Domain (Optional)**

**If you have a custom domain:**

```bash
# Map your domain
gcloud run domain-mappings create \
  --service nature-medica \
  --domain www.yourdomain.com \
  --region us-central1

# Follow the instructions to update your DNS records
```

---

## 🔄 Making Updates / Redeploying

**When you make code changes:**

```bash
# Navigate to project
cd "/Users/harsh/Developer/Personal Projects/Nature Medica/my-app"

# Redeploy
gcloud builds submit --config=cloudbuild.yaml
```

**That's it!** Your changes will be live in ~5-10 minutes.

---

## 📊 Monitoring Your App

**View logs:**

```bash
# Real-time logs
gcloud run services logs tail nature-medica --region=us-central1

# Recent logs
gcloud run services logs read nature-medica --region=us-central1 --limit=50
```

**Check service status:**

```bash
gcloud run services describe nature-medica --region=us-central1
```

**View in Cloud Console:**

```bash
# Open Cloud Run dashboard
open "https://console.cloud.google.com/run"
```

---

## 💰 Cost Estimate

**Google Cloud Run Pricing:**

- **Free tier**: 2 million requests/month
- **Compute**: ~$0.00002448 per vCPU-second
- **Memory**: ~$0.00000250 per GiB-second
- **Requests**: ~$0.40 per million beyond free tier

**Expected monthly cost for moderate traffic:** $5-20/month

---

## 🆘 Troubleshooting

### Build Failure?

**Check build logs:**

```bash
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

**Common issues:**

1. **Secrets not accessible** → Check Step 5.3 permissions
2. **MongoDB connection fails** → Verify MONGODB_URI secret
3. **Build timeout** → Increase timeout in cloudbuild.yaml

### Deployment Successful but App Not Working?

**Check environment variables:**

```bash
gcloud run services describe nature-medica \
  --region=us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

**View runtime logs:**

```bash
gcloud run services logs tail nature-medica --region=us-central1
```

### Need to Update a Secret?

```bash
# Update MongoDB URI
echo -n "new-mongodb-connection-string" | \
  gcloud secrets versions add mongodb-uri --data-file=-

# Redeploy to use new secret
gcloud builds submit --config=cloudbuild.yaml
```

---

## 🎓 Quick Reference Commands

```bash
# View your app URL
gcloud run services describe nature-medica --region=us-central1 --format="value(status.url)"

# Redeploy
gcloud builds submit --config=cloudbuild.yaml

# View logs
gcloud run services logs tail nature-medica --region=us-central1

# List secrets
gcloud secrets list

# Update environment variable
gcloud run services update nature-medica --region=us-central1 --update-env-vars "KEY=VALUE"

# Delete service (if needed)
gcloud run services delete nature-medica --region=us-central1
```

---

## ✅ Success Checklist

After deployment, verify:

- [ ] App URL is accessible
- [ ] All pages load correctly
- [ ] Database connections work
- [ ] Authentication functions
- [ ] Image uploads work (Cloudinary)
- [ ] Payment gateways configured
- [ ] Email notifications sending

---

## 🎉 Congratulations!

Your Nature Medica app is now live on Google Cloud!

**Next steps:**

1. Set up monitoring and alerts
2. Configure custom domain
3. Set up CI/CD with GitHub
4. Enable Cloud CDN for better performance
5. Set up backup strategy

**Need help?** Check:

- Google Cloud documentation: https://cloud.google.com/run/docs
- Your deployment logs: `gcloud builds list`
- Cloud Console: https://console.cloud.google.com

---

**Your app is production-ready! 🌿✨**
