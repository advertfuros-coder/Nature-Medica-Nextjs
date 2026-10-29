import { NextResponse } from "next/server";
import { processShippingWebhook } from "@/lib/tracking-service";

/**
 * Universal Shipping Webhook Handler
 * Route: /api/webhooks/shipping
 *
 * NOTE: Shiprocket blocks webhook URLs containing 'shiprocket', 'sr', or 'kartrocket'.
 * This neutral '/api/webhooks/shipping' endpoint complies with Shiprocket's strict URL guidelines.
 */
export async function POST(req) {
  try {
    const payload = await req.json();
    console.log("🚚 Shipping webhook received:", JSON.stringify(payload).substring(0, 300));

    // Optional: Validate x-api-key if configured in Shiprocket / webhook panel
    const apiKey = req.headers.get("x-api-key");
    const configuredSecret = process.env.SHIPPING_WEBHOOK_SECRET;
    if (configuredSecret && apiKey && apiKey !== configuredSecret) {
      console.warn("⚠️ Invalid webhook secret key");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await processShippingWebhook(payload);

    if (result.success) {
      console.log(`✅ Webhook processed for order ${result.orderId}: ${result.tracking?.currentStatus}`);
      return NextResponse.json({
        success: true,
        message: "Webhook processed successfully",
        orderId: result.orderId,
      });
    } else {
      console.warn("⚠️ Webhook processing notice:", result.message);
      return NextResponse.json({
        success: false,
        message: result.message,
      }, { status: 200 }); // Return 200 so courier does not aggressively retry if order not found
    }
  } catch (error) {
    console.error("❌ Shipping webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}

// Allow GET for simple health check
export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Shipping webhook endpoint is healthy and ready to receive updates.",
  });
}
