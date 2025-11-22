# Coupon Management - Live Server Debugging Guide

## Problem
Coupons are working on local system but not on the live server (adding/editing fails).

## Changes Made

### 1. Enhanced API Error Handling

#### `/api/admin/coupons` (POST - Create Coupon)
- ✅ Separated authentication and database connection error handling
- ✅ Added field validation with specific error messages
- ✅ Added duplicate coupon code detection
- ✅ Added detailed error logging with emoji indicators (✅/❌)
- ✅ Returns error details in response for debugging

#### `/api/admin/coupons/[id]` (PUT - Update Coupon)
- ✅ Enhanced authentication error handling
- ✅ Added field validation
- ✅ Added duplicate code check (excluding current coupon)
- ✅ Added `runValidators: true` to ensure data integrity
- ✅ Detailed error logging and responses

#### `/api/admin/coupons/[id]` (DELETE - Delete Coupon)
- ✅ Enhanced authentication error handling
- ✅ Better not-found error messages
- ✅ Detailed error logging

### 2. Enhanced Frontend Error Handling

#### `CouponList.jsx`
- ✅ Displays detailed error messages from API
- ✅ Console logs full error details for debugging
- ✅ Shows network errors separately
- ✅ Improved user feedback

## Common Issues on Live Server & Solutions

### Issue 1: Authentication Failure
**Symptoms:** 401 Unauthorized error
**Error Message:** "Unauthorized - Admin access required"
**Solutions:**
1. Check if admin is logged in on live server
2. Verify JWT token is being sent correctly
3. Check cookie settings (secure, sameSite, domain)
4. Verify `NEXTAUTH_SECRET` environment variable is set

### Issue 2: Database Connection
**Symptoms:** 500 error with "Database connection failed"
**Error Message:** "Database connection failed"
**Solutions:**
1. Verify `MONGODB_URI` environment variable on live server
2. Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
3. Verify database user credentials
4. Check network connectivity from server to MongoDB

### Issue 3: Missing Environment Variables
**Symptoms:** Various 500 errors
**Solutions:**
1. Verify all environment variables are set on live server:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
2. Restart the application after adding env variables

### Issue 4: Duplicate Coupon Code
**Symptoms:** 409 Conflict error
**Error Message:** "Coupon code 'XXXX' already exists"
**Solution:** Use a different coupon code

### Issue 5: Validation Errors
**Symptoms:** 400 Bad Request
**Error Message:** "Missing required fields"
**Solution:** Ensure all required fields are filled:
- code
- type
- value
- minOrderValue
- expiryDate

## How to Debug on Live Server

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try creating/editing a coupon
4. Look for error messages logged by the frontend

### Step 2: Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try creating/editing a coupon
4. Click on the failed request
5. Check:
   - **Request Headers:** Is authentication token present?
   - **Request Payload:** Is data being sent correctly?
   - **Response:** What error is the server returning?

### Step 3: Check Server Logs
1. Access your hosting platform's logs (Vercel, Railway, etc.)
2. Look for error messages with ❌ emoji
3. Check for:
   - Authentication errors
   - Database connection errors
   - Validation errors

### Step 4: Test API Directly
Use a tool like Postman or curl to test the API:

```bash
# Test Create Coupon
curl -X POST https://your-domain.com/api/admin/coupons \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "code": "TEST20",
    "type": "percent",
    "value": 20,
    "minOrderValue": 500,
    "expiryDate": "2025-12-31",
    "description": "Test coupon",
    "active": true
  }'
```

## Expected Error Responses

### Success (200/201)
```json
{
  "success": true,
  "coupon": { ... }
}
```

### Authentication Error (401)
```json
{
  "error": "Unauthorized - Admin access required",
  "details": "Token expired" // or other auth error
}
```

### Validation Error (400)
```json
{
  "error": "Missing required fields",
  "required": ["code", "type", "value", "minOrderValue", "expiryDate"]
}
```

### Duplicate Code (409)
```json
{
  "error": "Coupon code 'SAVE20' already exists"
}
```

### Database Error (500)
```json
{
  "error": "Database connection failed",
  "details": "Connection timeout"
}
```

## Quick Checklist

- [ ] Admin is logged in on live server
- [ ] All environment variables are set correctly
- [ ] MongoDB connection string is correct
- [ ] MongoDB IP whitelist includes server IP (or 0.0.0.0/0)
- [ ] Application has been restarted after env variable changes
- [ ] Browser cookies are enabled
- [ ] No ad blockers interfering with requests
- [ ] CORS is configured correctly (if applicable)

## Next Steps

1. **Deploy these changes** to your live server
2. **Try creating a coupon** and check the error message
3. **Check browser console** for detailed error logs
4. **Check server logs** for backend errors
5. **Share the specific error message** for further debugging

The enhanced error handling will now tell you exactly what's wrong instead of generic "Failed to create coupon" messages.
