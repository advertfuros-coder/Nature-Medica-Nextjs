import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ "products.product": 1 });

// Method to check if product exists in wishlist
wishlistSchema.methods.hasProduct = function (productId) {
  return this.products.some(
    (item) => item.product.toString() === productId.toString()
  );
};

// Method to get product count
wishlistSchema.methods.getProductCount = function () {
  return this.products.length;
};

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);
