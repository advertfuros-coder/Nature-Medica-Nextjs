import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

/**
 * POST /api/admin/orders/fix-order-nm000097
 * Fixes order NM000097 by:
 * - Changing payment mode to COD
 * - Resetting shipment fields
 * - Allowing re-shipping with correct COD label
 */
export async function POST(req) {
  try {
    await connectDB();

    const orderId = "NM000097";
    console.log(`\n🔍 Finding order ${orderId}...`);

    // Find the order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { error: `Order ${orderId} not found` },
        { status: 404 }
      );
    }

    console.log("\n📋 Current Order Status:");
    console.log("  Order ID:", order.orderId);
    console.log("  Payment Mode:", order.paymentMode);
    console.log("  Payment Status:", order.paymentStatus);
    console.log("  Order Status:", order.orderStatus);
    console.log("  Courier:", order.courierName || "None");
    console.log("  Tracking ID:", order.trackingId || "None");

    // Update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        // Change to COD
        paymentMode: "cod",
        paymentStatus: "pending",

        // Reset order status to allow re-shipping
        orderStatus: "Processing",

        // Clear all shipment data
        shippingProvider: null,
        courierName: null,
        trackingId: null,
        estimatedDelivery: null,

        // Clear Ekart data
        "ekart.trackingId": null,
        "ekart.waybillNumber": null,
        "ekart.vendor": null,
        "ekart.shipmentStatus": null,
        "ekart.cancelledAt": new Date(),

        // Clear Delhivery data
        delhiveryWaybill: null,

        // Clear Shiprocket data
        shiprocketOrderId: null,
        shiprocketShipmentId: null,

        // Add status history entry
        $push: {
          statusHistory: {
            status: "Processing",
            updatedAt: new Date(),
            note: "Order reset to COD - Ready for re-shipment with correct label",
          },
        },
      },
      { new: true }
    );

    console.log("\n✅ Order updated successfully!");
    console.log("  Payment Mode:", updatedOrder.paymentMode);
    console.log("  Payment Status:", updatedOrder.paymentStatus);
    console.log("  Order Status:", updatedOrder.orderStatus);

    return NextResponse.json({
      success: true,
      message: `✅ Order ${orderId} has been reset to COD and is ready for re-shipment!`,
      order: {
        orderId: updatedOrder.orderId,
        paymentMode: updatedOrder.paymentMode,
        paymentStatus: updatedOrder.paymentStatus,
        orderStatus: updatedOrder.orderStatus,
        finalPrice: updatedOrder.finalPrice,
        shippingAddress: updatedOrder.shippingAddress,
        items: updatedOrder.items,
      },
      nextSteps: [
        "Go to Admin Panel → Orders",
        `Find order #${orderId}`,
        'Click "Ship" and select your preferred courier (Ekart/Delhivery)',
        `The label will now show "COD" with amount ₹${updatedOrder.finalPrice}`,
      ],
    });
  } catch (error) {
    console.error("❌ Error fixing order:", error);
    return NextResponse.json(
      {
        error: "Failed to fix order",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
