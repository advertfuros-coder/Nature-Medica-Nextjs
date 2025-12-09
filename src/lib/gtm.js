/**
 * Google Tag Manager Event Tracking Utilities
 * Implements GA4 E-commerce events for GTM following exact dataLayer structure
 */

/**
 * Push event to GTM dataLayer
 * @param {Object} eventData - The event data to push
 */
const pushToDataLayer = (eventData) => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
    console.log("GTM Event:", eventData); // For debugging
  }
};

/**
 * Format product item for GTM events - exact structure as specified
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity of the product
 * @param {string} variant - Product variant (optional)
 * @param {number} price - Product price (optional, uses product.price if not provided)
 * @param {number} discount - Discount amount (optional, for purchase event)
 * @returns {Object} Formatted product data
 */
const formatProductItem = (
  product,
  quantity = 1,
  variant = "",
  price = null,
  discount = ""
) => {
  const itemPrice = price || product.price || 0;

  return {
    item_id: String(product._id || product.id || ""),
    item_name: String(product.title || product.name || ""),
    item_brand: String(product.brand || ""),
    item_category: String(product.category?.name || ""),
    item_variant: String(variant || ""),
    price: String(itemPrice),
    quantity: String(quantity),
    ...(discount !== "" && { discount: String(discount) }),
  };
};

/**
 * 1. Track View Item event (Product detail page)
 * @param {Object} product - Product being viewed
 * @param {string} variant - Selected variant (optional)
 */
export const trackViewItem = (product, variant = "") => {
  const price = product.price || 0;

  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: "INR",
      value: String(price),
      items: [formatProductItem(product, 1, variant, price)],
    },
  });
};

/**
 * 2. Track Add to Cart event
 * @param {Object} product - Product being added
 * @param {number} quantity - Quantity being added
 * @param {string} variant - Product variant (optional)
 */
export const trackAddToCart = (product, quantity = 1, variant = "") => {
  const price = product.price || 0;
  const value = price * quantity;

  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency: "INR",
      value: String(value),
      items: [formatProductItem(product, quantity, variant, price)],
    },
  });
};

/**
 * Track Remove from Cart event
 * @param {Object} product - Product being removed
 * @param {number} quantity - Quantity being removed
 * @param {string} variant - Product variant (optional)
 */
export const trackRemoveFromCart = (product, quantity = 1, variant = "") => {
  const price = product.price || 0;
  const value = price * quantity;

  pushToDataLayer({
    event: "remove_from_cart",
    ecommerce: {
      currency: "INR",
      value: String(value),
      items: [formatProductItem(product, quantity, variant, price)],
    },
  });
};

/**
 * 3. Track Begin Checkout event (Checkout started)
 * @param {Array} items - Array of cart items
 * @param {number} totalValue - Total checkout value
 * @param {string} couponCode - Applied coupon code (optional)
 */
export const trackBeginCheckout = (items, totalValue, couponCode = "") => {
  const formattedItems = items.map((item) =>
    formatProductItem(
      item.product,
      item.quantity,
      item.variant || "",
      item.price || item.product.price
    )
  );

  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency: "INR",
      value: String(totalValue),
      coupon: String(couponCode),
      items: formattedItems,
    },
  });
};

/**
 * 4. Track Checkout event (Shipping/Payment method selected)
 * @param {Array} items - Array of cart items
 * @param {number} totalValue - Total checkout value
 * @param {string} shippingTier - Shipping method (e.g., "Standard", "Express")
 * @param {string} couponCode - Applied coupon code (optional)
 */
export const trackCheckout = (
  items,
  totalValue,
  shippingTier = "Standard",
  couponCode = ""
) => {
  const formattedItems = items.map((item) =>
    formatProductItem(
      item.product,
      item.quantity,
      item.variant || "",
      item.price || item.product.price
    )
  );

  pushToDataLayer({
    event: "checkout",
    ecommerce: {
      currency: "INR",
      value: String(totalValue),
      shipping_tier: String(shippingTier),
      coupon: String(couponCode),
      items: formattedItems,
    },
  });
};

/**
 * 5. Track Purchase event (Order success page)
 * @param {Object} orderData - Order information
 */
export const trackPurchase = (orderData) => {
  const {
    orderId,
    items,
    total,
    tax = 0,
    shipping = 49,
    couponCode = "",
    discount = 0,
  } = orderData;

  const formattedItems = items.map((item) => {
    const itemDiscount = item.discount || "";
    const itemCoupon = item.coupon || "";

    return {
      ...formatProductItem(
        item.product,
        item.quantity,
        item.variant || "",
        item.price || item.product.price,
        itemDiscount
      ),
      ...(itemCoupon && { coupon: String(itemCoupon) }),
    };
  });

  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: String(orderId),
      value: String(total),
      tax: String(tax),
      shipping: String(shipping),
      currency: "INR",
      coupon: String(couponCode),
      items: formattedItems,
    },
  });
};

/**
 * Track View Cart event
 * @param {Array} items - Array of cart items
 * @param {number} totalValue - Total cart value
 */
export const trackViewCart = (items, totalValue) => {
  const formattedItems = items.map((item) =>
    formatProductItem(
      item.product,
      item.quantity,
      item.variant || "",
      item.price || item.product.price
    )
  );

  pushToDataLayer({
    event: "view_cart",
    ecommerce: {
      currency: "INR",
      value: String(totalValue),
      items: formattedItems,
    },
  });
};

/**
 * Track product list view
 * @param {Array} products - Array of products being viewed
 * @param {string} listName - Name of the list (e.g., "Search Results", "Category Page")
 */
export const trackViewItemList = (products, listName = "Product Listing") => {
  const formattedItems = products.slice(0, 10).map((product, index) => ({
    ...formatProductItem(product, 1),
    index: index,
    item_list_name: listName,
  }));

  pushToDataLayer({
    event: "view_item_list",
    ecommerce: {
      item_list_name: listName,
      items: formattedItems,
    },
  });
};

/**
 * Track when user selects a product from a list
 * @param {Object} product - Product being selected
 * @param {string} listName - Name of the list
 * @param {number} index - Position in the list
 */
export const trackSelectItem = (
  product,
  listName = "Product Listing",
  index = 0
) => {
  const productData = {
    ...formatProductItem(product, 1),
    index: index,
    item_list_name: listName,
  };

  pushToDataLayer({
    event: "select_item",
    ecommerce: {
      item_list_name: listName,
      items: [productData],
    },
  });
};

/**
 * Track search event
 * @param {string} searchTerm - The search query
 */
export const trackSearch = (searchTerm) => {
  pushToDataLayer({
    event: "search",
    search_term: searchTerm,
  });
};
