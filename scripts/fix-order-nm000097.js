/**
 * Script to fix Order #NM000097
 * - Changes payment mode to COD
 * - Resets shipment fields
 * - Allows re-shipping with correct COD label
 */

const mongoose = require("mongoose");
const path = require("path");

// Load environment variables from .env.local
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env.local");
    }
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Order Schema (simplified)
const OrderSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

async function fixOrder() {
  try {
    await connectDB();

    const orderId = "NM000097";
    console.log(`\n🔍 Finding order ${orderId}...`);

    // Find the order
    const order = await Order.findOne({ orderId });

    if (!order) {
      console.error(`❌ Order ${orderId} not found`);
      process.exit(1);
    }

    console.log("\n📋 Current Order Status:");
    console.log("  Order ID:", order.orderId);
    console.log("  Payment Mode:", order.paymentMode);
    console.log("  Payment Status:", order.paymentStatus);
    console.log("  Order Status:", order.orderStatus);
    console.log("  Courier:", order.courierName || "None");
    console.log("  Tracking ID:", order.trackingId || "None");
    console.log("  Ekart Tracking:", order.ekart?.trackingId || "None");

    // Prepare update
    const updates = {
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
      ekart: {
        trackingId: null,
        waybillNumber: null,
        vendor: null,
        orderNumber: null,
        codWaybill: null,
        shipmentStatus: null,
        labelUrl: null,
        manifestUrl: null,
        createdAt: null,
        cancelledAt: new Date(),
        deliveredAt: null,
      },

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
    };

    console.log("\n🔧 Applying updates...");
    console.log("  ✓ Payment Mode: cod");
    console.log("  ✓ Payment Status: pending");
    console.log("  ✓ Order Status: Processing");
    console.log("  ✓ Clearing all shipment data");

    // Update the order
    const updatedOrder = await Order.findOneAndUpdate({ orderId }, updates, {
      new: true,
    });

    console.log("\n✅ Order updated successfully!");
    console.log("\n📋 Updated Order Status:");
    console.log("  Order ID:", updatedOrder.orderId);
    console.log("  Payment Mode:", updatedOrder.paymentMode);
    console.log("  Payment Status:", updatedOrder.paymentStatus);
    console.log("  Order Status:", updatedOrder.orderStatus);
    console.log(
      "  Courier:",
      updatedOrder.courierName || "None (Ready for shipping)"
    );
    console.log(
      "  Tracking ID:",
      updatedOrder.trackingId || "None (Ready for shipping)"
    );

    console.log("\n🎉 Order #NM000097 is now ready to be shipped as COD!");
    console.log("\n📝 Next Steps:");
    console.log("  1. Go to Admin Panel → Orders");
    console.log("  2. Find order #NM000097");
    console.log('  3. Click "Ship" and select your preferred courier');
    console.log(
      '  4. The label will now show "COD" with amount ₹' +
        updatedOrder.finalPrice
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error fixing order:", error);
    process.exit(1);
  }
}

// Run the script
fixOrder();
