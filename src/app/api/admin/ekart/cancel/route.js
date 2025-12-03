import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import ekartAPI from "@/lib/ekart";

/**
 * POST /api/admin/ekart/cancel
 * Cancel Ekart shipment
 */
export async function POST(req) {
  try {
    await connectDB();

    const { orderId, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if shipment exists
    if (!order.ekart?.trackingId) {
      return NextResponse.json(
        { error: "No Ekart shipment found for this order" },
        { status: 400 }
      );
    }

    console.log("🚫 Cancelling Ekart shipment:", order.ekart.trackingId);

    // Cancel shipment with Ekart
    const cancelResponse = await ekartAPI.cancelShipment(
      order.ekart.trackingId
    );

    if (!cancelResponse.status) {
      return NextResponse.json(
        { error: "Failed to cancel shipment", details: cancelResponse.remark },
        { status: 500 }
      );
    }

    // Update order
    order.orderStatus = "Cancelled";
    order.ekart.shipmentStatus = "Cancelled";
    order.ekart.cancelledAt = new Date();

    // Add to status history
    order.statusHistory.push({
      status: "Cancelled",
      updatedAt: new Date(),
      note: `Ekart shipment cancelled. Reason: ${reason || "Not specified"}`,
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Shipment cancelled successfully",
      trackingId: order.ekart.trackingId,
    });
  } catch (error) {
    console.error("❌ Ekart cancel shipment error:", error);
    return NextResponse.json(
      {
        error: "Failed to cancel shipment",
        details: error.response?.data?.message || error.message,
      },
      { status: 500 }
    );
  }
}
