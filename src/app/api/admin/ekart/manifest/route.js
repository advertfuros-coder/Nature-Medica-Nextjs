import { NextResponse } from "next/server";
import ekartAPI from "@/lib/ekart";

/**
 * POST /api/admin/ekart/manifest
 * Download manifest for Ekart shipments
 */
export async function POST(req) {
  try {
    const { trackingIds } = await req.json();

    if (
      !trackingIds ||
      !Array.isArray(trackingIds) ||
      trackingIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Tracking IDs array is required" },
        { status: 400 }
      );
    }

    if (trackingIds.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 tracking IDs allowed at once" },
        { status: 400 }
      );
    }

    console.log("📋 Downloading manifest for:", trackingIds);

    const manifestData = await ekartAPI.downloadManifest(trackingIds);

    return NextResponse.json({
      success: true,
      manifestUrls: manifestData,
    });
  } catch (error) {
    console.error("❌ Ekart download manifest error:", error);
    return NextResponse.json(
      {
        error: "Failed to download manifest",
        details: error.response?.data?.message || error.message,
      },
      { status: 500 }
    );
  }
}
