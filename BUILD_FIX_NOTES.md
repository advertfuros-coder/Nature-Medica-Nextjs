# Build Fix Summary

## Issue

Build failing with cloudinary and nodemailer module resolution errors in Next.js 15.

## Root Cause

- Cloudinary v2.x has internal module resolution issues with Next.js webpack
- The package tries to resolve `./lib/cloudinary` which doesn't exist in the npm package

## Solution Options

### Option 1: Use Cloudinary SDK v1 (Recommended)

```bash
npm uninstall cloudinary
npm install cloudinary@1.41.3
```

### Option 2: Use serverComponentsExternalPackages in next.config.js

Add to `next.config.js`:

```javascript
experimental: {
  serverComponentsExternalPackages: ['cloudinary', 'nodemailer'],
},
```

### Option 3: Dynamic Imports (Current Approach)

- Added `export const runtime = 'nodejs'` to all API routes using cloudinary/nodemailer
- This tells Next.js to use Node.js runtime for these routes

## Files Modified

- `/src/app/api/admin/categories/route.js` - Added runtime config
- `/src/app/api/admin/banners/route.js` - Added runtime config
- `/src/app/api/admin/banners/[id]/route.js` - Added runtime config
- `/src/app/api/admin/products/route.js` - Added runtime config
- `/src/app/api/admin/products/[id]/route.js` - Added runtime config
- `/src/app/api/admin/products/create/route.js` - Added runtime config
- `/src/app/api/admin/categories/[id]/route.js` - Added runtime config
- `/src/app/api/returns/create/route.js` - Added runtime config
- `/src/app/api/contact/route.js` - Added runtime config

## Next Steps

Try Option 2 (serverComponentsExternalPackages) as it's the most reliable for Next.js 15.
