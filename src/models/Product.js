import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  price: { type: Number },
  stock: { type: Number },
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    variants: [VariantSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    ingredients: { type: String },
    specifications: { type: Map, of: String },
    ratingAvg: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    visibility: { type: Boolean, default: true },

    // NEW FIELDS - Product Badges
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create text index for search
ProductSchema.index({ title: "text", description: "text" });

// Indexes for filtering by badges
ProductSchema.index({ isBestSeller: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ isFeatured: 1 });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
