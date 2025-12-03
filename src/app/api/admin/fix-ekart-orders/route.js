import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

/**
 * POST /api/admin/fix-ekart-orders
 *
 * Migration endpoint to fix existing Ekart orders.
 * Updates orders that have ekart.trackingId but no generic trackingId.
 */
export async function POST(req) {
  try {
    await connectDB();

    console.log("🔍 Finding Ekart orders to fix...");

    // Find all orders with ekart.trackingId but no trackingId
    const ordersToFix = await Order.find({
      "ekart.trackingId": { $exists: true, $ne: null },
      $or: [
        { trackingId: { $exists: false } },
        { trackingId: null },
        { trackingId: "" },
      ],
    });

    console.log(`📦 Found ${ordersToFix.length} orders to fix`);

    if (ordersToFix.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No orders need fixing",
        fixed: 0,
      });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Update each order
    for (const order of ordersToFix) {
      try {
        // Set trackingId to ekart.trackingId
        order.trackingId = order.ekart.trackingId;
        await order.save({ validateBeforeSave: false });

        results.push({
          orderId: order.orderId,
          trackingId: order.ekart.trackingId,
          status: "success",
        });

        console.log(
          `✅ Fixed ${order.orderId} - set trackingId to ${order.ekart.trackingId}`
        );
        successCount++;
      } catch (error) {
        results.push({
          orderId: order.orderId,
          status: "error",
          error: error.message,
        });

        console.error(`❌ Error fixing ${order.orderId}:`, error.message);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      summary: {
        total: ordersToFix.length,
        success: successCount,
        errors: errorCount,
      },
      results,
    });
  } catch (error) {
    console.error("❌ Migration error:", error);
    return NextResponse.json(
      {
        error: "Migration failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
