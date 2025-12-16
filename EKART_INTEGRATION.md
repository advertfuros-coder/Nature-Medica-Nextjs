# 🚚 Ekart Logistics Integration Guide

Complete integration of Ekart Logistics API for shipping orders from Nature Medica admin panel.

---

## 📋 Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Features Implemented](#features-implemented)
3. [API Endpoints](#api-endpoints)
4. [Admin Panel Usage](#admin-panel-usage)
5. [Environment Variables](#environment-variables)
6. [Order Model Updates](#order-model-updates)
7. [Webhooks (Optional)](#webhooks-optional)
8. [Testing](#testing)

---

## 🔧 Setup & Configuration

### 1. Add Environment Variables

Add these variables to your `.env.local` file:

```bash
# Ekart Logistics Credentials
EKART_CLIENT_ID=your_client_id_from_ekart
EKART_USERNAME=your_username_from_ekart
EKART_PASSWORD=your_password_from_ekart

# Ekart Seller Information
EKART_SELLER_NAME="Nature Medica"
EKART_SELLER_ADDRESS="Your complete seller address"
EKART_GST_NUMBER="Your GST number"

# Ekart Warehouse Locations (optional if pre-registered)
EKART_PICKUP_LOCATION_NAME="Nature Medica Warehouse"
EKART_RETURN_LOCATION_NAME="Nature Medica Warehouse"
```

### 2. Get Ekart Credentials

Contact Ekart Logistics to get:

- **Client ID** - Provided during onboarding
- **Username** - Your Ekart account username
- **Password** - Your Ekart account password

---

## ✨ Features Implemented

### Backend (API Routes)

✅ **Authentication** - Automatic token management with 24h caching  
✅ **Create Shipment** - Create forward shipments with Ekart  
✅ **Cancel Shipment** - Cancel shipments before pickup  
✅ **Track Shipment** - Real-time tracking of shipments  
✅ **Download Labels** - Generate PDF shipping labels  
✅ **Download Manifest** - Generate manifest for pickup  
✅ **Check Serviceability** - Verify pincode serviceability  
✅ **Get Estimates** - Get shipping rate estimates

### Database

✅ **Order Model Updated** - New fields for Ekart shipping data  
✅ **Tracking Integration** - Ekart tracking ID linked to orders  
✅ **Status History** - Automatic tracking of shipment status changes

---

## 🌐 API Endpoints

### 1. Create Shipment

**POST** `/api/admin/ekart/ship`

**Request:**

```json
{
  "orderId": "NM000123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Shipment created successfully",
  "trackingId": "5009 99A3408005",
  "vendor": "EKART",
  "waybillNumber": "318019134877",
  "trackingUrl": "https://app.elite.ekartlogistics.in/track/500999A3408005"
}
```

---

### 2. Cancel Shipment

**POST** `/api/admin/ekart/cancel`

**Request:**

```json
{
  "orderId": "NM000123",
  "reason": "Customer requested cancellation"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Shipment cancelled successfully",
  "trackingId": "500999A3408005"
}
```

---

### 3. Track Shipment

**GET** `/api/admin/ekart/track?trackingId=500999A3408005`

**Response:**

```json
{
  "success": true,
  "trackingId": "500999A3408005",
  "trackingData": {
    "status": "Delivered",
    "location": "Mumbai",
    "desc": "Delivered Successfully",
    "ctime": 1657523187604
  },
  "publicUrl": "https://app.elite.ekartlogistics.in/track/500999A3408005"
}
```

---

### 4. Download Labels

**POST** `/api/admin/ekart/label`

**Request:**

```json
{
  "trackingIds": ["500999A3408005", "500999A3408006"],
  "jsonOnly": false
}
```

**Response:** PDF file download

---

### 5. Download Manifest

**POST** `/api/admin/ekart/manifest`

**Request:**

```json
{
  "trackingIds": ["500999A3408005", "500999A3408006"]
}
```

**Response:**

```json
{
  "success": true,
  "manifestUrls": {
    "500999A3408005": "https://manifest-url-1.pdf",
    "500999A3408006": "https://manifest-url-2.pdf"
  }
}
```

---

## 🎯 Admin Panel Usage

### How to Ship an Order via Ekart

1. Go to **Admin Panel** → **Orders**
2. Click on an order (must be **Paid**)
3. Click **"Ship via Ekart"** button
4. System will:

   - Create shipment with Ekart
   - Update order status to "Shipped"
   - Save tracking ID
   - Generate shipping label

5. **Download Label** for the package
6. **Download Manifest** for courier pickup
7. Hand over package to Ekart courier

---

## 🔐 Environment Variables Reference

| Variable                     | Description                  | Example                    | Required    |
| ---------------------------- | ---------------------------- | -------------------------- | ----------- |
| `EKART_CLIENT_ID`            | Client ID from Ekart         | `ABC123XYZ`                | ✅ Yes      |
| `EKART_USERNAME`             | Ekart account username       | `naturemedica@example.com` | ✅ Yes      |
| `EKART_PASSWORD`             | Ekart account password       | `SecurePass123!`           | ✅ Yes      |
| `EKART_SELLER_NAME`          | Your business name           | `Nature Medica`            | ✅ Yes      |
| `EKART_SELLER_ADDRESS`       | Complete seller address      | `123 Main St, Mumbai`      | ✅ Yes      |
| `EKART_GST_NUMBER`           | Your GST number              | `27AAAAA0000A1Z5`          | ✅ Yes      |
| `EKART_PICKUP_LOCATION_NAME` | Warehouse alias (optional)   | `Main Warehouse`           | ⚠️ Optional |
| `EKART_RETURN_LOCATION_NAME` | RTO address alias (optional) | `Main Warehouse`           | ⚠️ Optional |

---

## 📊 Order Model Updates

New fields added to Order model:

```javascript
{
  shippingProvider: "ekart", // Updated enum

  ekart: {
    trackingId: "500999A3408005",     // Ekart tracking ID
    waybillNumber: "318019134877",     // Vendor waybill
    vendor: "EKART",                   // Courier partner name
    orderNumber: "NM000123",           // Order number
    channelId: "66111e20da60dcb528",   // Ekart order ID
    codWaybill: "",                     // COD waybill (for COD)
    shipmentStatus: "Created",         // Status
    labelUrl: "https://...",           // Label PDF URL
    manifestUrl: "https://...",        // Manifest PDF URL
    createdAt: Date,                   // Creation timestamp
    cancelledAt: Date,                 // Cancellation timestamp
    deliveredAt: Date                  // Delivery timestamp
  }
}
```

---

## 🔔 Webhooks (Optional)

Ekart supports webhooks for real-time updates:

1. **track_updated** - Tracking status changes
2. **shipment_created** - New shipment created
3. **shipment_recreated** - Shipment re-created

**Setup webhook:**

```javascript
// Use the Ekart API utility
import ekartAPI from "@/lib/ekart";

await ekartAPI.addWebhook({
  event: "track_updated",
  url: "https://yourdomain.com/api/webhooks/ekart/tracking",
});
```

---

## 🧪 Testing

### Test Shipment Creation

```bash
curl -X POST http://localhost:3000/api/admin/ekart/ship \
  -H "Content-Type: application/json" \
  -d '{"orderId": "NM000123"}'
```

### Test Tracking

```bash
curl http://localhost:3000/api/admin/ekart/track?trackingId=500999A3408005
```

### Test Cancellation

```bash
curl -X POST http://localhost:3000/api/admin/ekart/cancel \
  -H "Content-Type: application/json" \
  -d '{"orderId": "NM000123", "reason": "Test cancellation"}'
```

---

## 📝 Important Notes

1. **Payment Mode**: All orders are marked as "Prepaid" since Nature Medica only accepts online payments
2. **Wallet Balance**: **CRITICAL** - Ekart requires sufficient wallet balance for prepaid shipments. You must maintain adequate balance in your Ekart account. Recharge at: https://app.elite.ekartlogistics.in/
3. **Default Dimensions**: Package dimensions default to 30x20x15 cm if not specified
4. **Weight Calculation**: Auto-calculated from product weights (defaults to 500g per product)
5. **GST Calculation**: Assumes 18% GST on all products
6. **Token Caching**: Access token is cached for 24 hours for efficiency
7. **Retry Logic**: Automatic retry on token expiry
8. **Error Handling**: Comprehensive error messages for debugging
9. **Legacy Data**: System automatically fixes invalid payment modes in old orders during shipment creation

---

## 🔧 Troubleshooting

### Error: "Insufficient Ekart Wallet Balance"

**Problem**: Ekart requires prepaid wallet balance to create prepaid shipments.

**Solution**:

1. Login to your Ekart dashboard: https://app.elite.ekartlogistics.in/
2. Navigate to "Wallet" or "Recharge"
3. Add sufficient balance to your wallet
4. Retry creating the shipment

### Error: "Schema Validation Error - pin: string found, integer expected"

**Problem**: Pincode is being sent as string instead of integer.

**Solution**: This has been fixed in the code. The pincode and phone are now automatically converted to integers.

### Error: "Order validation failed: paymentMode: 'cod' is not a valid enum value"

**Problem**: Legacy orders in database have invalid `paymentMode` values.

**Solution**: This has been fixed. The system now:

- Automatically corrects invalid paymentMode to "online"
- Bypasses validation errors for legacy data
- Logs a warning when fixing invalid data

### Error: "required property 'country' not found"

**Problem**: Missing country field in drop_location.

**Solution**: This has been fixed. Country is now automatically set to "India" for all shipments.

---

## 🚀 Next Steps

1. ✅ **Add environment variables** to `.env.local`
2. ✅ **Register pickup/return addresses** with Ekart (via account manager)
3. ✅ **Test in sandbox** before going live
4. ✅ **Setup webhooks** for automatic status updates (optional)
5. ✅ **Train admin staff** on using the shipping panel

---

## 💡 Tips

- Always download labels before handing over packages
- Download manifest for multiple shipments together for pickup
- Track shipments regularly to update customers
- Use the public tracking URL for customer sharing: `https://app.elite.ekartlogistics.in/track/{trackingId}`

---

## 📞 Support

For Ekart API issues:

- **Email**: support@ekartlogistics.in
- **Phone**: Contact your account manager
- **Docs**: https://app.elite.ekartlogistics.in/api/docs

For integration issues:

- Check server logs for detailed error messages
- Verify environment variables are set correctly
- Ensure order is in "Paid" status before shipping

---

**Integration Complete! 🎉**

You can now ship orders via Ekart from your admin panel!
