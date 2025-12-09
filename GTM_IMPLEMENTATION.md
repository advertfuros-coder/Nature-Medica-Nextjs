# GTM E-commerce Tracking - Implementation Complete ✅

## Overview

All required e-commerce dataLayer events have been implemented following the exact structure specified for accurate conversion tracking across Google Ads and Meta Ads.

## Implemented Events

### 1. ✅ view_item (Product Detail Page)

**Triggers when:** User views a product detail page

**Location:** `/src/components/customer/ProductInfo.jsx`

**DataLayer Structure:**

```javascript
window.dataLayer.push({
  event: "view_item",
  ecommerce: {
    currency: "INR",
    value: "599", // product price or selected variant price
    items: [
      {
        item_id: "507f1f77bcf86cd799439011",
        item_name: "Organic Ashwagandha Capsules",
        item_brand: "Himalaya",
        item_category: "Supplements",
        item_variant: "60 Capsules",
        price: "599",
        quantity: "1",
      },
    ],
  },
});
```

---

### 2. ✅ add_to_cart (When User Adds Product to Cart)

**Triggers when:**

- User clicks "Add to Cart" on product card
- User clicks "Add to Cart" on product detail page
- User clicks "Buy Now" (adds to cart before checkout redirect)

**Locations:**

- `/src/components/customer/ProductCard.jsx`
- `/src/components/customer/ProductInfo.jsx`

**DataLayer Structure:**

```javascript
window.dataLayer.push({
  event: "add_to_cart",
  ecommerce: {
    currency: "INR",
    value: "1198", // price * quantity
    items: [
      {
        item_id: "507f1f77bcf86cd799439011",
        item_name: "Organic Ashwagandha Capsules",
        item_brand: "Himalaya",
        item_category: "Supplements",
        item_variant: "60 Capsules",
        price: "599",
        quantity: "2",
      },
    ],
  },
});
```

---

### 3. ✅ begin_checkout (Checkout Started)

**Triggers when:** User clicks "Proceed to Checkout" button on cart page

**Location:** `/src/components/customer/CartClient.jsx`

**DataLayer Structure:**

```javascript
window.dataLayer.push({
  event: "begin_checkout",
  ecommerce: {
    currency: "INR",
    value: "1247", // cart total value
    coupon: "WELCOME10", // applied coupon code if any, else ""
    items: [
      {
        item_id: "507f1f77bcf86cd799439011",
        item_name: "Organic Ashwagandha Capsules",
        item_brand: "Himalaya",
        item_category: "Supplements",
        item_variant: "60 Capsules",
        price: "599",
        quantity: "2",
      },
      // ... all cart items
    ],
  },
});
```

---

### 4. ✅ checkout (Shipping/Payment Method Selected)

**Triggers when:** User selects payment method on checkout page

**Location:** `/src/app/checkout/page.jsx`

**DataLayer Structure:**

```javascript
window.dataLayer.push({
  event: "checkout",
  ecommerce: {
    currency: "INR",
    value: "1247", // updated cart total
    shipping_tier: "Standard", // e.g. "Standard", "Express"
    coupon: "WELCOME10",
    items: [
      {
        item_id: "507f1f77bcf86cd799439011",
        item_name: "Organic Ashwagandha Capsules",
        item_brand: "Himalaya",
        item_category: "Supplements",
        item_variant: "60 Capsules",
        price: "599",
        quantity: "2",
      },
      // ... all items in checkout
    ],
  },
});
```

---

### 5. ✅ purchase (Order Success)

**Triggers when:**

- COD order is successfully created
- Online payment is successfully verified and order is created

**Locations:**

- `/src/app/checkout/page.jsx` - COD orders
- `/src/app/payment/status/page.jsx` - Online payment orders

**DataLayer Structure:**

```javascript
window.dataLayer.push({
  event: "purchase",
  ecommerce: {
    transaction_id: "NM000123", // unique order ID
    value: "1247", // total order value (including tax & shipping)
    tax: "0", // total tax amount
    shipping: "49", // total shipping amount
    currency: "INR",
    coupon: "WELCOME10", // applied coupon code if any
    items: [
      {
        item_id: "507f1f77bcf86cd799439011",
        item_name: "Organic Ashwagandha Capsules",
        item_brand: "Himalaya",
        item_category: "Supplements",
        item_variant: "60 Capsules",
        price: "599",
        quantity: "2",
        discount: "", // discount per item (optional)
        coupon: "", // item-level coupon if different (optional)
      },
      // ... all ordered products
    ],
  },
});
```

---

## Additional Events Implemented

### ✅ remove_from_cart

**Triggers when:** User removes item from cart

**Location:** `/src/components/customer/CartClient.jsx`

### ✅ view_cart

**Triggers when:** Cart page loads with items

**Location:** `/src/components/customer/CartClient.jsx`

---

## Key Implementation Details

### Data Format

✅ All values are **strings** as per specification:

- `value: "1247"` (not `value: 1247`)
- `quantity: "2"` (not `quantity: 2`)
- `price: "599"` (not `price: 599`)

### Empty Values

✅ Optional fields use **empty strings** instead of null:

- `coupon: ""` (when no coupon applied)
- `item_variant: ""` (when no variant selected)
- `item_brand: ""` (when brand not available)

### Dynamic Data

✅ All values are **dynamically populated** from backend:

- Product ID from database `_id`
- Product name, brand, category from product data
- Variant from selected option
- Price from product or variant
- Quantity from user selection
- Coupon from applied discount code
- Transaction ID from order creation

### Currency

✅ Always set to `"INR"` for Indian Rupees

---

## GTM Utility Library

**File:** `/src/lib/gtm.js`

This contains all tracking functions with exact dataLayer structure:

```javascript
// Track functions available
trackViewItem(product, variant);
trackAddToCart(product, quantity, variant);
trackRemoveFromCart(product, quantity, variant);
trackBeginCheckout(items, totalValue, couponCode);
trackCheckout(items, totalValue, shippingTier, couponCode);
trackPurchase(orderData);
trackViewCart(items, totalValue);
```

All functions automatically:

- Initialize `window.dataLayer` if not exists
- Convert values to strings
- Use empty strings for optional fields
- Log events to console for debugging

---

## Testing

### Browser Console Test

1. Open http://localhost:3001
2. Press F12 → Console tab
3. Perform actions (view product, add to cart, checkout)
4. See logs: `GTM Event: { event: "add_to_cart", ... }`

### GTM Preview Test

1. Go to GTM dashboard
2. Click "Preview"
3. Enter your site URL
4. Perform e-commerce actions
5. View events in GTM debugger

### Verify DataLayer

Check the dataLayer in console:

```javascript
console.table(window.dataLayer);
```

---

## Event Flow Example

1. User views product → `view_item`
2. User adds to cart → `add_to_cart`
3. User views cart → `view_cart`
4. User clicks checkout → `begin_checkout`
5. User selects payment → `checkout`
6. Order success → `purchase`

---

## Files Modified

| File                                       | Events Tracked                                    |
| ------------------------------------------ | ------------------------------------------------- |
| `/src/lib/gtm.js`                          | Core utility with all tracking functions          |
| `/src/components/customer/ProductInfo.jsx` | `view_item`, `add_to_cart`                        |
| `/src/components/customer/ProductCard.jsx` | `add_to_cart`                                     |
| `/src/components/customer/CartClient.jsx`  | `remove_from_cart`, `view_cart`, `begin_checkout` |
| `/src/app/checkout/page.jsx`               | `checkout`, `purchase` (COD)                      |
| `/src/app/payment/status/page.jsx`         | `purchase` (Online payment)                       |

---

## Google Ads & Meta Ads Setup

### For Google Ads

1. In GTM, create triggers for each event
2. Create GA4 tags that fire on these triggers
3. Link GA4 to Google Ads account
4. Use events for conversion tracking

### For Meta Ads (Facebook Pixel)

1. In GTM, create Facebook Pixel tags
2. Map e-commerce events to Meta events:
   - `view_item` → ViewContent
   - `add_to_cart` → AddToCart
   - `begin_checkout` → InitiateCheckout
   - `purchase` → Purchase
3. Pass same ecommerce data to Meta

---

## Production Checklist

- ✅ All 5 required events implemented
- ✅ Exact dataLayer structure followed
- ✅ All values dynamically populated from backend
- ✅ String format for all numeric values
- ✅ Empty strings for optional fields
- ✅ Console logging enabled for debugging
- ✅ Works for both COD and online payments
- ✅ Variant support included
- ✅ Coupon tracking included
- ❗ Remove console.log in production if needed

---

## Support

For issues or questions:

1. Check browser console for GTM Event logs
2. Verify `window.dataLayer` exists
3. Use GTM Preview mode for real-time debugging
4. Review this documentation

**Implementation Date:** December 9, 2025  
**GTM Container ID:** GTM-TWJVCM2P
