import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { requireAdmin } from "@/middleware/auth";

export async function PUT(req, { params }) {
  try {
    // Check authentication first
    try {
      await requireAdmin(req);
    } catch (authError) {
      console.error("Admin auth failed:", authError);
      return NextResponse.json(
        {
          error: "Unauthorized - Admin access required",
          details: authError.message,
        },
        { status: 401 }
      );
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError.message },
        { status: 500 }
      );
    }

    const formData = await req.json();
    const couponId = params.id;

    // Validate required fields
    if (
      !formData.code ||
      !formData.type ||
      !formData.value ||
      !formData.minOrderValue ||
      !formData.expiryDate
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["code", "type", "value", "minOrderValue", "expiryDate"],
        },
        { status: 400 }
      );
    }

    // Check for duplicate coupon code (excluding current coupon)
    const existingCoupon = await Coupon.findOne({
      code: formData.code.toUpperCase(),
      _id: { $ne: couponId },
    });
    if (existingCoupon) {
      return NextResponse.json(
        {
          error: `Coupon code '${formData.code.toUpperCase()}' already exists`,
        },
        { status: 409 }
      );
    }

    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      { ...formData, code: formData.code.toUpperCase() },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found", couponId },
        { status: 404 }
      );
    }

    console.log("✅ Coupon updated successfully:", coupon.code);

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("❌ Update coupon error:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000 && error.keyValue?.code) {
      return NextResponse.json(
        {
          error: `Coupon code '${error.keyValue.code}' already exists`,
          details:
            "This coupon code is already in use. Please choose a different code.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update coupon",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    // Check authentication first
    try {
      await requireAdmin(req);
    } catch (authError) {
      console.error("Admin auth failed:", authError);
      return NextResponse.json(
        {
          error: "Unauthorized - Admin access required",
          details: authError.message,
        },
        { status: 401 }
      );
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError.message },
        { status: 500 }
      );
    }

    const couponId = params.id;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found", couponId },
        { status: 404 }
      );
    }

    console.log("✅ Coupon deleted successfully:", coupon.code);

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
      deletedCoupon: coupon.code,
    });
  } catch (error) {
    console.error("❌ Delete coupon error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete coupon",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
