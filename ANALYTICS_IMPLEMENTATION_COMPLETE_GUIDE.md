# Google Analytics 4 DataLayer Implementation Guide
## Complete Implementation for All Pages

---

## ✅ COMPLETED

### 1. Analytics Utility Created
**File:** `/src/utils/analytics.js` ✅
- All 14 tracking functions implemented
- Proper dataLayer structure for GA4
- Console logging for debugging

### 2. Product Detail Page
**File:** `/src/components/customer/ProductInfo.jsx` ✅
- ✅ `view_item` - Tracks when product is viewed
- ✅ `add_to_cart` - Tracks when added to cart
- ✅ `add_to_cart` - Tracks "Buy Now" action

---

## 📋 REMAINING IMPLEMENTATIONS

### 3. Cart Page
**File:** `/src/app/cart/page.jsx`

**Add these imports:**
```javascript
import { trackViewCart, trackRemoveFromCart, trackBeginCheckout } from '@/utils/analytics';
```

**Add in useEffect (on page load):**
```javascript
useEffect(() => {
  if (cartItems.length > 0) {
    const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    trackViewCart(cartItems, totalValue);
  }
}, [cartItems]);
```

**Add in remove item handler:**
```javascript
const handleRemoveItem = (item) => {
  trackRemoveFromCart(item, item.quantity);
  dispatch(removeFromCart(item._id));
};
```

**Add in checkout button:**
```javascript
const handleCheckout = () => {
  const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  trackBeginCheckout(cartItems, totalValue, couponCode);
  router.push('/checkout');
};
```

---

### 4. Checkout Page
**File:** `/src/app/checkout/page.jsx`

**Add these imports:**
```javascript
import { trackBeginCheckout, trackAddShippingInfo, trackAddPaymentInfo } from '@/utils/analytics';
```

**Add in useEffect (on page load):**
```javascript
useEffect(() => {
  if (cartItems.length > 0) {
    trackBeginCheckout(cartItems, totalAmount, couponCode);
  }
}, []);
```

**Add when shipping address is entered:**
```javascript
const handleShippingSubmit = (shippingData) => {
  trackAddShippingInfo(cartItems, totalAmount, 'Standard', couponCode);
  // Continue with form submission
};
```

**Add when payment method is selected:**
```javascript
const handlePaymentSelect = (paymentMethod) => {
  setPaymentMode(paymentMethod);
  trackAddPaymentInfo(cartItems, totalAmount, paymentMethod, couponCode);
};
```

---

### 5. Order Success Pages
**Files:** 
- `/src/app/checkout/success/page.jsx`
- `/src/app/thankyou/page.jsx`
- `/src/app/payment/success/page.jsx`

**Add this import:**
```javascript
import { trackPurchase } from '@/utils/analytics';
```

**Add in useEffect (on page load):**
```javascript
useEffect(() => {
  if (order) {
    trackPurchase(order);
  }
}, [order]);
```

---

### 6. Product Listing Pages
**File:** `/src/app/products/page.js`

**Add these imports:**
```javascript
import { trackViewItemList } from '@/utils/analytics';
```

**Add in useEffect when products load:**
```javascript
useEffect(() => {
  if (products.length > 0) {
    trackViewItemList(products, 'Product Listing');
  }
}, [products]);
```

---

### 7. Product Card Component
**File:** `/src/components/customer/ProductCard.jsx`

**Add these imports:**
```javascript
import { trackSelectItem, trackAddToCart } from '@/utils/analytics';
```

**Add in product click handler:**
```javascript
const handleProductClick = () => {
  trackSelectItem(product, 'Product Grid', index);
  // Navigate to product page
};
```

**Add in quick add to cart:**
```javascript
const handleQuickAdd = () => {
  dispatch(addToCart({ product, quantity: 1 }));
  trackAddToCart(product, 1);
};
```

---

### 8. Search Component
**File:** Search component (wherever it is)

**Add this import:**
```javascript
import { trackSearch } from '@/utils/analytics';
```

**Add in search submit:**
```javascript
const handleSearch = (searchTerm) => {
  trackSearch(searchTerm);
  // Perform search
};
```

---

### 9. Authentication Pages
**File:** `/src/app/auth/page.jsx`

**Add these imports:**
```javascript
import { trackSignUp, trackLogin } from '@/utils/analytics';
```

**Add after successful registration:**
```javascript
const handleSignUp = async (userData) => {
  // ... registration logic
  if (success) {
    trackSignUp('email');
  }
};
```

**Add after successful login:**
```javascript
const handleLogin = async (credentials) => {
  // ... login logic
  if (success) {
    trackLogin('email');
  }
};
```

---

### 10. Page View Tracking (All Pages)
**File:** `/src/app/layout.js` or create a PageViewTracker component

**Option A: In layout.js**
```javascript
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/utils/analytics';

export function PageViewTracker() {
  const pathname = usePathname();
  
  useEffect(() => {
    trackPageView(pathname, document.title);
  }, [pathname]);
  
  return null;
}
```

**Then add to layout:**
```javascript
<body>
  <PageViewTracker />
  {children}
</body>
```

**Option B: In individual pages**
```javascript
useEffect(() => {
  trackPageView(window.location.pathname, 'Page Title');
}, []);
```

---

## 🎯 Priority Implementation Order

### Phase 1: Critical Conversion Tracking (Do First)
1. ✅ Product Detail - view_item, add_to_cart
2. ⏳ Cart Page - view_cart, remove_from_cart, begin_checkout
3. ⏳ Checkout Page - add_shipping_info, add_payment_info
4. ⏳ Success Pages - purchase

### Phase 2: User Journey Tracking
5. ⏳ Product Listing - view_item_list
6. ⏳ Product Card - select_item
7. ⏳ Page View Tracking

### Phase 3: Engagement Tracking
8. ⏳ Search - search event
9. ⏳ Auth Pages - sign_up, login

---

## 🧪 Testing Instructions

### 1. Open Browser Console
```javascript
// Check dataLayer
console.log(window.dataLayer);
```

### 2. Test Each Event
- View a product → Check for `view_item`
- Add to cart → Check for `add_to_cart`
- Go to cart → Check for `view_cart`
- Proceed to checkout → Check for `begin_checkout`
- Enter shipping → Check for `add_shipping_info`
- Select payment → Check for `add_payment_info`
- Complete order → Check for `purchase`

### 3. Verify Event Structure
Each event should have:
```javascript
{
  event: "event_name",
  ecommerce: {
    currency: "INR",
    value: 123.45,
    items: [
      {
        item_id: "...",
        item_name: "...",
        item_brand: "Nature Medica",
        price: 123.45,
        quantity: 1
      }
    ]
  }
}
```

### 4. Use Google Tag Assistant
- Install Chrome extension
- Enable Tag Assistant
- Navigate through your site
- Check for GA4 events firing

---

## 📊 Expected DataLayer Events

### Product Detail Page
```
view_item → add_to_cart
```

### Shopping Flow
```
view_item_list → select_item → view_item → add_to_cart → 
view_cart → begin_checkout → add_shipping_info → 
add_payment_info → purchase
```

### Search Flow
```
search → view_item_list → select_item → view_item
```

---

## 🔍 Debugging

### Check if dataLayer exists
```javascript
console.log(window.dataLayer);
```

### Check last event
```javascript
console.log(window.dataLayer[window.dataLayer.length - 1]);
```

### Clear dataLayer (for testing)
```javascript
window.dataLayer = [];
```

---

## 📝 Notes

- All events use `INR` currency
- Brand is always "Nature Medica"
- Events automatically log to console
- Server components need client wrappers
- Use `useEffect` for page load events
- Use event handlers for user actions

---

## ✅ Verification Checklist

After implementation:

- [ ] Product detail page fires `view_item`
- [ ] Add to cart fires `add_to_cart`
- [ ] Cart page fires `view_cart`
- [ ] Remove from cart fires `remove_from_cart`
- [ ] Checkout button fires `begin_checkout`
- [ ] Shipping form fires `add_shipping_info`
- [ ] Payment selection fires `add_payment_info`
- [ ] Order success fires `purchase`
- [ ] Product listing fires `view_item_list`
- [ ] Product click fires `select_item`
- [ ] Search fires `search`
- [ ] Registration fires `sign_up`
- [ ] Login fires `login`
- [ ] All pages fire `page_view`

---

## 🚀 Next Steps

1. Implement Cart Page tracking
2. Implement Checkout Page tracking
3. Implement Success Page tracking
4. Implement Product Listing tracking
5. Implement Page View tracking
6. Test all events
7. Verify in Google Analytics
8. Verify in Google Ads
9. Verify in Meta Ads

---

**Status:** Phase 1 Started (Product Detail ✅)  
**Next:** Cart Page Implementation  
**Date:** 2025-12-16
