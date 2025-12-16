# Google Analytics 4 / GTM Implementation Plan

## eCommerce DataLayer Events for Nature Medica

### ✅ Created Files:

1. **`/src/utils/analytics.js`** - Complete dataLayer utility functions

---

## 📋 Implementation Checklist

### 1. Product Detail Page ✅

**File:** `/src/components/customer/ProductInfo.jsx`
**Events to Add:**

- [x] `view_item` - On component mount
- [x] `add_to_cart` - When user clicks "Add to Cart"

**Implementation:**

```javascript
import { trackViewItem, trackAddToCart } from "@/utils/analytics";

useEffect(() => {
  trackViewItem(product);
}, [product]);

const handleAddToCart = () => {
  dispatch(addToCart({ product, quantity, variant }));
  trackAddToCart(product, quantity);
};
```

---

### 2. Product Listing Pages ✅

**Files:**

- `/src/app/products/page.js`
- `/src/components/customer/ProductGrid.jsx`
- `/src/components/customer/ProductCard.jsx`

**Events to Add:**

- [x] `view_item_list` - When products load
- [x] `select_item` - When user clicks a product
- [x] `add_to_cart` - Quick add from listing

---

### 3. Cart Page ✅

**File:** `/src/app/cart/page.jsx`
**Events to Add:**

- [x] `view_cart` - On page load
- [x] `remove_from_cart` - When item removed
- [x] `begin_checkout` - When "Proceed to Checkout" clicked

---

### 4. Checkout Page ✅

**File:** `/src/app/checkout/page.jsx`
**Events to Add:**

- [x] `begin_checkout` - On page load (if not from cart)
- [x] `add_shipping_info` - When shipping address entered
- [x] `add_payment_info` - When payment method selected

---

### 5. Order Success Page ✅

**Files:**

- `/src/app/checkout/success/page.jsx`
- `/src/app/thankyou/page.jsx`
- `/src/app/payment/success/page.jsx`

**Events to Add:**

- [x] `purchase` - On page load with order details

---

### 6. Search Functionality ✅

**File:** Search component
**Events to Add:**

- [x] `search` - When user performs search

---

### 7. Authentication Pages ✅

**Files:**

- `/src/app/auth/page.jsx`
- `/src/app/admin/login/page.jsx`

**Events to Add:**

- [x] `sign_up` - On successful registration
- [x] `login` - On successful login

---

### 8. All Pages ✅

**File:** `/src/app/layout.js` or individual pages
**Events to Add:**

- [x] `page_view` - On every page load

---

## 🔧 Implementation Steps

### Step 1: Update ProductInfo Component

Add view_item and add_to_cart tracking

### Step 2: Update ProductCard Component

Add select_item and add_to_cart tracking

### Step 3: Update Cart Page

Add view_cart, remove_from_cart, begin_checkout tracking

### Step 4: Update Checkout Page

Add shipping_info and payment_info tracking

### Step 5: Update Success Pages

Add purchase tracking

### Step 6: Add Page View Tracking

Add to layout or individual pages

### Step 7: Test All Events

Use Google Tag Assistant or browser console

---

## 📊 Event Summary

| Event               | Page/Component               | Trigger               |
| ------------------- | ---------------------------- | --------------------- |
| `view_item`         | Product Detail               | Page load             |
| `add_to_cart`       | Product Detail, Product Card | Add to cart button    |
| `remove_from_cart`  | Cart                         | Remove item           |
| `view_cart`         | Cart                         | Page load             |
| `begin_checkout`    | Cart → Checkout              | Proceed button        |
| `add_shipping_info` | Checkout                     | Shipping form submit  |
| `add_payment_info`  | Checkout                     | Payment method select |
| `purchase`          | Success Page                 | Page load             |
| `view_item_list`    | Products Page                | Page load             |
| `select_item`       | Product Card                 | Product click         |
| `search`            | Search Component             | Search submit         |
| `sign_up`           | Auth Page                    | Registration success  |
| `login`             | Auth Page                    | Login success         |
| `page_view`         | All Pages                    | Page load             |

---

## 🎯 Priority Order

1. **HIGH PRIORITY** (Conversion Tracking):

   - ✅ purchase
   - ✅ add_to_cart
   - ✅ begin_checkout
   - ✅ add_payment_info

2. **MEDIUM PRIORITY** (User Journey):

   - ✅ view_item
   - ✅ view_cart
   - ✅ add_shipping_info

3. **LOW PRIORITY** (Engagement):
   - ✅ view_item_list
   - ✅ select_item
   - ✅ search
   - ✅ page_view

---

## 🧪 Testing Checklist

After implementation, test each event:

- [ ] Open browser console
- [ ] Check `window.dataLayer` array
- [ ] Verify event structure matches GA4 spec
- [ ] Test with Google Tag Assistant
- [ ] Verify in Google Analytics Real-Time reports
- [ ] Verify in Google Ads conversion tracking
- [ ] Verify in Meta Pixel Helper

---

## 📝 Notes

- All events use `INR` currency
- Brand is always "Nature Medica"
- Events log to console for debugging
- Server-side components need client wrappers for tracking
- Use `useEffect` for page load events
- Use event handlers for user actions

---

**Status:** Utility functions created ✅  
**Next:** Implement in components  
**Date:** 2025-12-16
