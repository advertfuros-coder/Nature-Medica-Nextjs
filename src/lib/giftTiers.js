// Cart milestones: free shipping, then free gifts. Shared by the cart, drawer,
// gift auto-manager and the order API (which re-checks eligibility server-side).

export const FREE_SHIPPING_THRESHOLD = 499;

export const GIFT_TIERS = [
  {
    threshold: 799,
    slug: 'buy-2-get-1-free-bamboo-toothbrush-100-natural-bamboo-wood-eco-friendly-charcoal-bristles-plastic-free-oral-care',
    label: 'Free Bamboo Brush',
  },
  {
    threshold: 1299,
    slug: 'aloe-vera-hydrating-night-face-gel-100g',
    label: 'Free Night Gel',
  },
];

export const MILESTONES = [
  { threshold: FREE_SHIPPING_THRESHOLD, label: 'Free Shipping' },
  ...GIFT_TIERS.map((t) => ({ threshold: t.threshold, label: t.label })),
];

// Subtotal of items the customer is paying for (gifts excluded)
export const paidSubtotal = (items) =>
  items
    .filter((item) => item.variant !== 'gift')
    .reduce((sum, item) => sum + (item.price || item.product.price) * item.quantity, 0);
