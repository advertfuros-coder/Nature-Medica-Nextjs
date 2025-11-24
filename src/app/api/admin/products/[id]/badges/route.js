import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/middleware/auth";

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const data = await req.json();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update badge fields
    if (typeof data.isBestSeller === "boolean") {
      product.isBestSeller = data.isBestSeller;
    }
    if (typeof data.isNewArrival === "boolean") {
      product.isNewArrival = data.isNewArrival;
    }
    if (typeof data.isFeatured === "boolean") {
      product.isFeatured = data.isFeatured;
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Badges updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update badges error:", error);
    return NextResponse.json(
      {
        error: "Failed to update badges",
      },
      { status: 500 }
    );
  }
}
