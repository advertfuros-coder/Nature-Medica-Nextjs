/**
 * Google Analytics 4 / Google Tag Manager DataLayer Utilities
 * For eCommerce tracking across Google Ads and Meta Ads
 */

/**
 * Initialize dataLayer if not exists
 */
export const initDataLayer = () => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
  }
};

/**
 * Format product item for dataLayer
 */
const formatItem = (product, quantity = 1) => {
  return {
    item_id: product._id || product.id || product.product || "",
    item_name: product.title || product.name || "",
    item_brand: "Nature Medica",
    item_category: product.category || "",
    item_variant: product.variant || "",
    price: parseFloat(product.price || 0),
    quantity: parseInt(quantity || 1),
  };
};

/**
 * 1. View Item Event (Product Detail Page)
 * Fires when user views a product detail page
 */
export const trackViewItem = (product) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency: "INR",
      value: parseFloat(product.price || 0),
      items: [formatItem(product, 1)],
    },
  });

  console.log("📊 DataLayer: view_item", product.title);
};

/**
 * 2. Add to Cart Event
 * Fires when user adds a product to cart
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  const value = parseFloat(product.price || 0) * parseInt(quantity || 1);

  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "INR",
      value: value,
      items: [formatItem(product, quantity)],
    },
  });

  console.log("📊 DataLayer: add_to_cart", product.title, "x", quantity);
};

/**
 * 3. Remove from Cart Event
 * Fires when user removes a product from cart
 */
export const trackRemoveFromCart = (product, quantity = 1) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  const value = parseFloat(product.price || 0) * parseInt(quantity || 1);

  window.dataLayer.push({
    event: "remove_from_cart",
    ecommerce: {
      currency: "INR",
      value: value,
      items: [formatItem(product, quantity)],
    },
  });

  console.log("📊 DataLayer: remove_from_cart", product.title);
};

/**
 * 4. Begin Checkout Event
 * Fires when user starts the checkout process
 */
export const trackBeginCheckout = (cartItems, totalValue, couponCode = "") => {
  if (typeof window === "undefined") return;

  initDataLayer();

  const items = cartItems.map((item) => formatItem(item, item.quantity));

  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "INR",
      value: parseFloat(totalValue || 0),
      coupon: couponCode || "",
      items: items,
    },
  });

  console.log("📊 DataLayer: begin_checkout", items.length, "items");
};

/**
 * 5. Add Shipping Info Event
 * Fires when user selects shipping method
 */
export const trackAddShippingInfo = (
  cartItems,
  totalValue,
  shippingTier = "Standard",
  couponCode = ""
) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  const items = cartItems.map((item) => formatItem(item, item.quantity));

  window.dataLayer.push({
    event: "add_shipping_info",
    ecommerce: {
      currency: "INR",
      value: parseFloat(totalValue || 0),
      shipping_tier: shippingTier,
      coupon: couponCode || "",
      items: items,
    },
  });

  console.log("📊 DataLayer: add_shipping_info", shippingTier);
};

/**
 * 6. Add Payment Info Event
 * Fires when user selects payment method
 */
export const trackAddPaymentInfo = (
  cartItems,
  totalValue,
  paymentType = "",
  couponCode = ""
) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  const items = cartItems.map((item) => formatItem(item, item.quantity));

  window.dataLayer.push({
    event: "add_payment_info",
    ecommerce: {
      currency: "INR",
      value: parseFloat(totalValue || 0),
      payment_type: paymentType, // 'online' or 'cod'
      coupon: couponCode || "",
      items: items,
    },
  });

  console.log("📊 DataLayer: add_payment_info", paymentType);
};

/**
 * 7. Purchase Event
 * Fires on order success page
 */
export const trackPurchase = (order) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  const items = (order.items || []).map((item) => ({
    item_id: item.product?._id || item.product || "",
    item_name: item.title || "",
    item_brand: "Nature Medica",
    item_category: item.category || "",
    item_variant: item.variant || "",
    price: parseFloat(item.price || 0),
    quantity: parseInt(item.quantity || 1),
    discount: parseFloat(item.discount || 0),
    coupon: order.couponCode || "",
  }));

  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: order.orderId || order._id || "",
      value: parseFloat(order.finalPrice || order.totalPrice || 0),
      tax: parseFloat(order.tax || 0),
      shipping: parseFloat(order.shippingCharges || 0),
      currency: "INR",
      coupon: order.couponCode || "",
      items: items,
    },
  });

  console.log("📊 DataLayer: purchase", order.orderId, "₹" + order.finalPrice);
};

/**
 * 8. View Cart Event
 * Fires when user views cart page
 */
export const trackViewCart = (cartItems, totalValue) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  const items = cartItems.map((item) => formatItem(item, item.quantity));

  window.dataLayer.push({
    event: "view_cart",
    ecommerce: {
      currency: "INR",
      value: parseFloat(totalValue || 0),
      items: items,
    },
  });

  console.log("📊 DataLayer: view_cart", items.length, "items");
};

/**
 * 9. View Item List Event
 * Fires when user views a product listing page
 */
export const trackViewItemList = (products, listName = "Product List") => {
  if (typeof window === "undefined") return;

  initDataLayer();

  const items = products.map((product, index) => ({
    ...formatItem(product, 1),
    index: index,
    item_list_name: listName,
  }));

  window.dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      item_list_name: listName,
      items: items,
    },
  });

  console.log("📊 DataLayer: view_item_list", listName, items.length, "items");
};

/**
 * 10. Select Item Event
 * Fires when user clicks on a product from a list
 */
export const trackSelectItem = (
  product,
  listName = "Product List",
  index = 0
) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  window.dataLayer.push({
    event: "select_item",
    ecommerce: {
      item_list_name: listName,
      items: [
        {
          ...formatItem(product, 1),
          index: index,
        },
      ],
    },
  });

  console.log("📊 DataLayer: select_item", product.title);
};

/**
 * 11. Search Event
 * Fires when user performs a search
 */
export const trackSearch = (searchTerm) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  window.dataLayer.push({
    event: "search",
    search_term: searchTerm,
  });

  console.log("📊 DataLayer: search", searchTerm);
};

/**
 * 12. Page View Event
 * Fires on every page load
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window === "undefined") return;

  initDataLayer();

  window.dataLayer.push({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle,
  });

  console.log("📊 DataLayer: page_view", pagePath);
};

/**
 * 13. Sign Up Event
 * Fires when user completes registration
 */
export const trackSignUp = (method = "email") => {
  if (typeof window === "undefined") return;

  initDataLayer();

  window.dataLayer.push({
    event: "sign_up",
    method: method,
  });

  console.log("📊 DataLayer: sign_up", method);
};

/**
 * 14. Login Event
 * Fires when user logs in
 */
export const trackLogin = (method = "email") => {
  if (typeof window === "undefined") return;

  initDataLayer();

  window.dataLayer.push({
    event: "login",
    method: method,
  });

  console.log("📊 DataLayer: login", method);
};

// Export all tracking functions
export default {
  trackViewItem,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackPurchase,
  trackViewCart,
  trackViewItemList,
  trackSelectItem,
  trackSearch,
  trackPageView,
  trackSignUp,
  trackLogin,
  initDataLayer,
};
