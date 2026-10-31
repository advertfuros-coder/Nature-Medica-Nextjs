// Cart milestones: free shipping, then free gifts. Shared by the cart, drawer,
// gift auto-manager and the order API (which re-checks eligibility server-side).

export const FREE_SHIPPING_THRESHOLD = 499;

export const GIFT_TIERS = [
  {
    threshold: 499,
    slug: 'nature-medica-bamboo-toothbrush-extra-soft',
    label: 'Free Bamboo Brush',
  },
  {
    threshold: 799,
    slug: 'aloe-vera-hydrating-night-face-gel-100g',
    label: 'Free Night Gel',
  },
  {
    threshold: 1299,
    slug: '24k-gold-face-serum-30ml',
    label: 'Free 24K Gold Serum',
  },
];

export const MILESTONES = [
  { threshold: 499, label: 'Free Bamboo Brush' },
  { threshold: 799, label: 'Free Night Gel' },
  { threshold: 1299, label: 'Free 24K Gold Serum' },
];

// Subtotal of items the customer is paying for (gifts excluded)
export const paidSubtotal = (items) =>
  items
    .filter((item) => item.variant !== 'gift')
    .reduce((sum, item) => sum + (item.price || item.product?.price || 0) * (item.quantity || 1), 0);
