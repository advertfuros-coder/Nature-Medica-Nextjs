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
        { status: 400 },
      );
    }

    // Find the order first to check its mode
    const existingOrder = await Order.findOne({ orderId });
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isSuccess =
      paymentStatus === "paid" || paymentStatus === "partially_paid";

    // Determine the correct status string
    let finalPaymentStatus = paymentStatus;
    if (isSuccess && existingOrder.isPartialCOD) {
      finalPaymentStatus = "partially_paid";
    }

    // Update the order
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: finalPaymentStatus,
        cashfreePaymentId,
        cashfreeOrderId,
        orderStatus: isSuccess ? "Processing" : "Pending",
        $push: {
          statusHistory: {
            status: isSuccess ? "Processing" : "Payment Failed",
            updatedAt: new Date(),
            note: isSuccess
              ? `Payment successful via Cashfree (Payment ID: ${cashfreePaymentId})${existingOrder.isPartialCOD ? " - Partial COD Advance" : ""}`
              : "Payment verification failed",
          },
        },
      },
      { new: true },
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
      { status: 500 },
    );
  }
}
