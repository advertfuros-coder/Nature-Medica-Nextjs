import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();

    // Get the current order count to generate next ID
    const orderCount = await Order.countDocuments();
    const orderId = `NM${String(orderCount + 1).padStart(6, "0")}`;

    return NextResponse.json({
      success: true,
      orderId,
    });
  } catch (error) {
    console.error("Generate Order ID error:", error);
    return NextResponse.json(
      { error: "Failed to generate order ID", details: error.message },
      { status: 500 }
    );
  }
}
