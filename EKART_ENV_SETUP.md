# 🔐 Ekart Environment Variables - Quick Reference

## ✅ What's Been Set Up:

### **`.env` File** (Template - Safe for Git)

- Contains **placeholder/example values**
- Safe to commit to version control
- Used as reference for developers

### **`.env.local` File** (Your Actual Credentials - NOT in Git)

- Contains **your real Ekart credentials**
- **NEVER committed to Git** (protected by .gitignore)
- Used by the application

---

## 📋 Current Status:

| Variable                     | `.env` (Template)                     | `.env.local` (Your Data)             | Status                |
| ---------------------------- | ------------------------------------- | ------------------------------------ | --------------------- |
| `EKART_CLIENT_ID`            | `your_client_id_from_ekart_dashboard` | `YOUR_CLIENT_ID_HERE_FROM_DASHBOARD` | ⚠️ **NEED TO UPDATE** |
| `EKART_USERNAME`             | `your_email@example.com`              | `naturemedica09@gmail.com`           | ✅ **SET**            |
| `EKART_PASSWORD`             | `your_secure_password`                | `Abid9721@@`                         | ✅ **SET**            |
| `EKART_SELLER_NAME`          | `"Your Business Name"`                | `"Nature Medica"`                    | ✅ **SET**            |
| `EKART_SELLER_ADDRESS`       | Template                              | Placeholder                          | ⚠️ **NEED TO UPDATE** |
| `EKART_GST_NUMBER`           | Template                              | Placeholder                          | ⚠️ **NEED TO UPDATE** |
| `EKART_PICKUP_LOCATION_NAME` | Template                              | `"Nature Medica Warehouse"`          | ⚠️ Optional           |
| `EKART_RETURN_LOCATION_NAME` | Template                              | `"Nature Medica Warehouse"`          | ⚠️ Optional           |

---

## 🎯 What You Need To Do:

### **Step 1: Get CLIENT_ID** (Most Important!)

1. Go to: https://app.elite.ekartlogistics.in/
2. Login with:
   - Email: `naturemedica09@gmail.com`
   - Password: `Abid9721@@`
3. Navigate to: **Dashboard → Settings → API Settings**
4. Copy your **CLIENT_ID**

### **Step 2: Update `.env.local`**

Open `/my-app/.env.local` and update:

```bash
# Replace this line:
EKART_CLIENT_ID=YOUR_CLIENT_ID_HERE_FROM_DASHBOARD

# With your actual CLIENT_ID (example):
EKART_CLIENT_ID=ABC123XYZ456
```

### **Step 3: Add Your Business Details**

Update these in `.env.local`:

```bash
# Complete seller address with pincode
EKART_SELLER_ADDRESS="123 Main Street, Landmark, Mumbai, Maharashtra, 400001"

# Your GST number (if registered)
EKART_GST_NUMBER="27AAAAA0000A1Z5"
# OR leave empty if no GST:
EKART_GST_NUMBER=""
```

### **Step 4: Restart Dev Server**

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### **Step 5: Test Integration**

```bash
node test-ekart-auth.js
```

You should see:

```
✅ Authentication successful!
🎉 Ekart integration is working!
```

---

## 📍 File Locations:

```
my-app/
├── .env                    # Template (safe for Git) ✅
├── .env.local             # Your credentials (NOT in Git) ✅
├── .env.local.backup      # Backup of previous version
├── test-ekart-auth.js     # Test script
└── EKART_INTEGRATION.md   # Full documentation
```

---

## 🔒 Security:

✅ **`.env.local` is protected** - Won't be committed to Git  
✅ **Backup created** - `.env.local.backup` (just in case)  
✅ **Template in `.env`** - Team members know what variables are needed

---

## ❓ Common Questions:

**Q: Where is my CLIENT_ID?**  
A: Login to Ekart dashboard → Settings → API Settings

**Q: What if I don't have GST?**  
A: Leave `EKART_GST_NUMBER=""` empty

**Q: Do I need pickup/return locations?**  
A: Only if you have MULTIPLE warehouses. If you have one, Ekart auto-fills it.

**Q: How to test if it's working?**  
A: Run `node test-ekart-auth.js` after adding CLIENT_ID

---

## 🚀 Quick Checklist:

- [ ] Got CLIENT_ID from Ekart dashboard
- [ ] Updated `EKART_CLIENT_ID` in `.env.local`
- [ ] Updated `EKART_SELLER_ADDRESS` with complete address
- [ ] Added `EKART_GST_NUMBER` (or left empty)
- [ ] Restarted dev server
- [ ] Ran test: `node test-ekart-auth.js`
- [ ] Saw success message ✅

---

**Next:** Once authentication test passes, you can start shipping orders via Ekart! 🎉
