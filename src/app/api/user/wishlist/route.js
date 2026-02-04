import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { authenticate } from "@/middleware/auth";

// GET - Fetch user's wishlist
export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (!auth.authenticated) {
      console.log("❌ No token found in cookies or invalid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = auth.user.userId;
    console.log("✅ Token decoded, userId:", userId);

    await connectDB();
    console.log("✅ Database connected");

    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "products.product",
      populate: { path: "category" },
    });

    console.log("📦 Wishlist from DB:", {
      exists: !!wishlist,
      productsCount: wishlist?.products?.length || 0,
      products: wishlist?.products || [],
    });

    if (!wishlist) {
      console.log("⚠️ No wishlist found, creating new one");
      wishlist = await Wishlist.create({ user: decoded.userId, products: [] });
    }

    // Filter out any null products (in case product was deleted)
    const validProducts = wishlist.products
      .map((item) => item.product)
      .filter(Boolean);

    console.log("✅ Valid products:", validProducts.length);
    console.log(
      "📋 Product IDs:",
      validProducts.map((p) => p._id),
    );

    return NextResponse.json({
      success: true,
      wishlist: validProducts,
      count: validProducts.length,
    });
  } catch (error) {
    console.error("❌ Wishlist GET error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch wishlist",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// POST - Add product to wishlist
export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (!auth.authenticated) {
      console.log("❌ POST: No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = auth.user.userId;
    console.log("✅ POST: Token decoded, userId:", userId);

    const { productId } = await request.json();
    console.log("📦 POST: Product ID to add:", productId);

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if product exists
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      console.log("❌ POST: Product not found:", productId);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.log("✅ POST: Product found:", product.title);

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    console.log("📋 POST: Existing wishlist:", {
      exists: !!wishlist,
      productsCount: wishlist?.products?.length || 0,
    });

    if (!wishlist) {
      console.log("⚠️ POST: Creating new wishlist");
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    // Check if product already in wishlist
    if (wishlist.hasProduct(productId)) {
      console.log("⚠️ POST: Product already in wishlist");
      return NextResponse.json(
        {
          success: false,
          message: "Product already in wishlist",
        },
        { status: 400 },
      );
    }

    // Add product to wishlist
    wishlist.products.push({ product: productId });
    console.log("➕ POST: Added product, saving...");

    await wishlist.save();
    console.log("✅ POST: Wishlist saved successfully");

    // Populate and return
    await wishlist.populate({
      path: "products.product",
      populate: { path: "category" },
    });

    const validProducts = wishlist.products
      .map((item) => item.product)
      .filter(Boolean);

    console.log(
      "✅ POST: Returning wishlist with",
      validProducts.length,
      "products",
    );

    return NextResponse.json({
      success: true,
      message: "Added to wishlist",
      wishlist: validProducts,
      count: validProducts.length,
    });
  } catch (error) {
    console.error("❌ Wishlist POST error:", error);
    return NextResponse.json(
      {
        error: "Failed to add to wishlist",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// DELETE - Remove product from wishlist
export async function DELETE(request) {
  try {
    const auth = await authenticate(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = auth.user.userId;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 },
      );
    }

    // Remove product
    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== productId,
    );
    await wishlist.save();

    await wishlist.populate({
      path: "products.product",
      populate: { path: "category" },
    });

    const validProducts = wishlist.products
      .map((item) => item.product)
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist",
      wishlist: validProducts,
      count: validProducts.length,
    });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      {
        error: "Failed to remove from wishlist",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
