import { NextResponse } from "next/server";
import { processShippingWebhook } from "@/lib/tracking-service";

/**
 * Shiprocket Webhook Route
 * NOTE: For new setups, prefer /api/webhooks/shipping because Shiprocket's dashboard
 * occasionally rejects URLs containing 'shiprocket'. This route is maintained for compatibility.
 */
export async function POST(req) {
  try {
    const payload = await req.json();
    console.log("📦 Legacy Shiprocket webhook received:", JSON.stringify(payload).substring(0, 300));

    const result = await processShippingWebhook(payload, "shiprocket");

    return NextResponse.json({
      success: result.success,
      message: result.message || "Webhook processed",
      orderId: result.orderId,
    });
  } catch (error) {
    console.error("❌ Shiprocket webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}
