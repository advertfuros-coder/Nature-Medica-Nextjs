import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();

    const { orderId, paymentStatus, cashfreePaymentId, cashfreeOrderId } =
      await req.json();

    if (!orderId || !paymentStatus) {
      return NextResponse.json(
        { error: "Order ID and payment status are required" },
        { status: 400 }
      );
    }

    // Find and update the order
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus,
        cashfreePaymentId,
        cashfreeOrderId,
        orderStatus: paymentStatus === "paid" ? "Processing" : "Pending",
        $push: {
          statusHistory: {
            status: paymentStatus === "paid" ? "Processing" : "Payment Failed",
            updatedAt: new Date(),
            note:
              paymentStatus === "paid"
                ? `Payment successful via Cashfree (Payment ID: ${cashfreePaymentId})`
                : "Payment verification failed",
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    return NextResponse.json(
      { error: "Failed to update payment status", details: error.message },
      { status: 500 }
    );
  }
}
