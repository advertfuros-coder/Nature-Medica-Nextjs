import { NextResponse } from "next/server";
import { processShippingWebhook } from "@/lib/tracking-service";

/**
 * Ekart Elite Webhook Handler
 * Route: /api/webhooks/ekart
 *
 * Receives track_updated and shipment events from Ekart Elite platform
 */
export async function POST(req) {
  try {
    const payload = await req.json();
    console.log("🚚 Ekart webhook received:", JSON.stringify(payload).substring(0, 300));

    const result = await processShippingWebhook(payload, "ekart");

    return NextResponse.json({
      success: result.success,
      message: result.message || "Ekart webhook processed",
      orderId: result.orderId,
    });
  } catch (error) {
    console.error("❌ Ekart webhook error:", error);
    return NextResponse.json(
      { error: "Ekart webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    provider: "ekart",
  });
}
