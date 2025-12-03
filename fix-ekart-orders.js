/**
 * Migration Script: Fix Ekart Orders
 *
 * This script updates all orders that have ekart.trackingId but no generic trackingId.
 * This ensures the UI properly displays the Ekart shipment buttons.
 *
 * Run with: node fix-ekart-orders.js
 */

require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI not found in environment variables");
  process.exit(1);
}

// Order Schema (simplified)
const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    trackingId: String,
    ekart: {
      trackingId: String,
      waybillNumber: String,
      vendor: String,
      orderNumber: String,
      codWaybill: String,
      shipmentStatus: String,
      createdAt: Date,
    },
  },
  { strict: false }
);

const Order = mongoose.model("Order", orderSchema);

async function fixEkartOrders() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find all orders with ekart.trackingId but no trackingId
    console.log("🔍 Searching for orders to fix...");
    const ordersToFix = await Order.find({
      "ekart.trackingId": { $exists: true, $ne: null },
      $or: [
        { trackingId: { $exists: false } },
        { trackingId: null },
        { trackingId: "" },
      ],
    });

    console.log(`📦 Found ${ordersToFix.length} orders to fix\n`);

    if (ordersToFix.length === 0) {
      console.log("✅ No orders need fixing. All done!");
      process.exit(0);
    }

    // Display orders that will be fixed
    console.log("Orders to be fixed:");
    ordersToFix.forEach((order) => {
      console.log(
        `  - ${order.orderId}: Will set trackingId to ${order.ekart.trackingId}`
      );
    });

    console.log(
      "\n⚠️  This will update the above orders. Continue? (Ctrl+C to cancel)"
    );
    console.log("Starting update in 3 seconds...\n");

    // Wait 3 seconds before proceeding
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update each order
    let successCount = 0;
    let errorCount = 0;

    for (const order of ordersToFix) {
      try {
        // Set trackingId to ekart.trackingId
        order.trackingId = order.ekart.trackingId;
        await order.save({ validateBeforeSave: false });

        console.log(
          `✅ Fixed ${order.orderId} - set trackingId to ${order.ekart.trackingId}`
        );
        successCount++;
      } catch (error) {
        console.error(`❌ Error fixing ${order.orderId}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary:");
    console.log("=".repeat(60));
    console.log(`✅ Successfully fixed: ${successCount} orders`);
    console.log(`❌ Errors: ${errorCount} orders`);
    console.log("=".repeat(60));

    console.log(
      "\n✨ Migration complete! You can now refresh the admin panel to see Ekart buttons."
    );
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the migration
console.log("🚀 Starting Ekart Orders Migration...\n");
fixEkartOrders();
