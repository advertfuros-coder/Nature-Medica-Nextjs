# Docker Build Troubleshooting Guide

## Common Build Errors and Solutions

### Error: `npm run build` returned non-zero code

This happens when the Next.js build fails during Docker build. Here are the solutions:

#### Solution 1: Remove Turbopack from Production Build ✅

**Problem**: Turbopack (`--turbopack`) is experimental and may cause build failures.

**Fix**: Already applied! We've updated `package.json`:

```json
"build": "next build"  // No --turbopack flag
```

#### Solution 2: Set Build Environment Variables

Next.js requires public environment variables (`NEXT_PUBLIC_*`) at **build time**, not just runtime.

**Option A: Using .env file (Local builds)**

Create `.env.production.local`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_value
NEXT_PUBLIC_GTM_ID=your_value
# Add all NEXT_PUBLIC_* vars
```

Then build:

```bash
docker build -t nature-medica:latest .
```

**Option B: Using Build Arguments (Cloud builds)**

Build with arguments:

```bash
docker build \
  --build-arg NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_value \
  --build-arg NEXT_PUBLIC_GTM_ID=GTM-PB77XJD6 \
  --build-arg NEXT_PUBLIC_API_URL=https://your-url/api \
  -t nature-medica:latest .
```

**Option C: For Cloud Build**

Update `cloudbuild.yaml` to pass environment variables as build args.

#### Solution 3: Check next.config.js

Ensure `next.config.js` has standalone output enabled:

```javascript
module.exports = {
  output: "standalone",
  // ... other config
};
```

✅ Already configured in your project!

#### Solution 4: Test Build Locally First

Before pushing to Cloud Build, test locally:

```bash
# Test the build
npm run build

# If successful, then build Docker
docker build -t nature-medica:test .
```

### Error: Module not found or Import errors

**Cause**: Missing dependencies or incorrect paths

**Fix**:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Then rebuild
docker build -t nature-medica:latest .
```

### Error: Out of memory

**Cause**: Docker doesn't have enough memory

**Fix**:

```bash
# Increase Docker memory (Docker Desktop UI)
# Settings → Resources → Memory → Set to 4GB+

# Or build with increased memory limit
docker build --memory=4g -t nature-medica:latest .
```

### Error: Failed to fetch dependencies

**Cause**: Network issues or rate limits

**Fix**:

```bash
# Use legacy peer deps
docker build --no-cache -t nature-medica:latest .
```

## Quick Fix Checklist

Before rebuilding, check:

- [ ] `package.json` has `"build": "next build"` (no turbopack)
- [ ] `next.config.js` has `output: 'standalone'`
- [ ] Local build works: `npm run build`
- [ ] Docker is running and has enough memory (4GB+)
- [ ] All `NEXT_PUBLIC_*` env vars are set (if needed at build time)
- [ ] No syntax errors in your code

## Testing Your Build

### 1. Test Next.js Build

```bash
npm run build
npm start
# Visit http://localhost:3000
```

### 2. Test Docker Build

```bash
# Build
docker build -t nature-medica:test .

# Run
docker run -p 3000:3000 \
  -e MONGODB_URI="your_uri" \
  -e NEXTAUTH_SECRET="your_secret" \
  nature-medica:test

# Visit http://localhost:3000
```

### 3. Test with Docker Compose

```bash
# Create .env.production with your values
cp env.production.example .env.production

# Build and run
docker-compose up --build
```

## Deploying to Google Cloud

After successful local build:

### Method 1: Cloud Build (Recommended)

```bash
gcloud builds submit --config=cloudbuild.yaml .
```

### Method 2: Manual Deploy

```bash
# Build locally
docker build -t gcr.io/YOUR_PROJECT_ID/nature-medica:latest .

# Push
gcloud auth configure-docker
docker push gcr.io/YOUR_PROJECT_ID/nature-medica:latest

# Deploy
gcloud run deploy nature-medica \
  --image gcr.io/YOUR_PROJECT_ID/nature-medica:latest \
  --region us-central1 \
  --platform managed
```

## Still Having Issues?

### Get Detailed Error Logs

```bash
# Local Docker build with verbose output
docker build --progress=plain --no-cache -t nature-medica:debug . 2>&1 | tee build.log

# Check the build.log file for specific errors
```

### Common Error Messages

| Error                               | Cause                     | Fix                                                |
| ----------------------------------- | ------------------------- | -------------------------------------------------- |
| `ENOENT: no such file or directory` | Missing file during build | Check `.dockerignore` isn't excluding needed files |
| `Cannot find module`                | Missing dependency        | Run `npm install` locally                          |
| `Unexpected token`                  | Syntax error in code      | Check recent code changes                          |
| `heap out of memory`                | Not enough memory         | Increase Docker memory limit                       |

## Need Help?

1. Check build logs carefully - the actual error is usually near the beginning
2. Test local build first: `npm run build`
3. Ensure Docker has enough resources
4. Check environment variables are set correctly
5. Review recent code changes for syntax errors

## Successfully Built?

Once your Docker build succeeds:

```bash
# Run the automated deployment
./deploy.sh

# Or follow QUICKSTART.md for manual steps
```

---

**Last Resort**: If nothing works, you can deploy without Docker using `gcloud app deploy` (App Engine) or check for Next.js-specific build errors in your code.
