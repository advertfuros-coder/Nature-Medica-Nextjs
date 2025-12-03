import { NextResponse } from "next/server";
import ekartAPI from "@/lib/ekart";

/**
 * GET /api/admin/ekart/track?trackingId=xxx
 * Track Ekart shipment (Public API - no auth required)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get("trackingId");

    if (!trackingId) {
      return NextResponse.json(
        { error: "Tracking ID is required" },
        { status: 400 }
      );
    }

    const trackingData = await ekartAPI.trackShipment(trackingId);

    return NextResponse.json({
      success: true,
      trackingId,
      trackingData,
      publicUrl: `https://app.elite.ekartlogistics.in/track/${trackingId}`,
    });
  } catch (error) {
    console.error("❌ Ekart track shipment error:", error);
    return NextResponse.json(
      {
        error: "Failed to track shipment",
        details: error.response?.data?.message || error.message,
      },
      { status: 500 }
    );
  }
}
