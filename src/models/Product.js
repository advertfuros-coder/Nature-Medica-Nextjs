import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, default: '' },
  price: { type: Number, required: true },
  mrp: { type: Number },
  stock: { type: Number, default: 0 },
  sku: { type: String, default: '' },
  image: { type: String, default: '' },
});

const ProductSchema = new mongoose.Schema(
  {
    // Basic Details
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, default: 'Nature Medica' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Media
    featuredImage: { type: String },
    images: [
      {
        url: String,
        publicId: String,
        altText: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // Pricing & Margins
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    costPerItem: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    gstSlab: { type: Number, default: 18 },
    hsnCode: { type: String, default: '3304' },

    // Inventory
    sku: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },

    // Ayurvedic & Skincare Science
    netQuantity: { type: String, default: '30 ml' },
    shelfLife: { type: String, default: '24 Months' },
    skinTypes: [{ type: String }],
    skinConcerns: [{ type: String }],
    keyActives: [
      {
        name: { type: String, default: '' },
        percentage: { type: String, default: '' },
        role: { type: String, default: '' },
      }
    ],
    ingredients: { type: String, default: '' },

    // Daily Ritual / How to Use
    usageTiming: [{ type: String }],
    howToUseSteps: [{ type: String }],
    precautions: { type: String, default: 'For external use only. Patch test recommended.' },

    // Trust & Certifications
    trustBadges: [{ type: String }],

    // Variants
    variants: [VariantSchema],

    // Specifications
    specifications: { type: mongoose.Schema.Types.Mixed, default: [] },

    // Shipping & Logistics
    weight: { type: Number, default: 150 },
    dimensions: {
      length: { type: Number, default: 10 },
      width: { type: Number, default: 5 },
      height: { type: Number, default: 5 },
    },
    isCodAvailable: { type: Boolean, default: true },
    isFragile: { type: Boolean, default: false },
    isReturnable: { type: Boolean, default: true },

    // Product FAQs
    faqs: [
      {
        question: { type: String, default: '' },
        answer: { type: String, default: '' },
      }
    ],

    // Merchandising & Visibility
    visibility: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    customBadge: { type: String, default: '' },
    tags: [{ type: String }],

    // Ratings
    ratingAvg: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    // SEO
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Create comprehensive text index for search
ProductSchema.index({
  title: "text",
  tagline: "text",
  description: "text",
  brand: "text",
  ingredients: "text",
});

// Indexes for filtering by badges
ProductSchema.index({ isBestSeller: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ visibility: 1 });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
