import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import ekartAPI from "@/lib/ekart";

/**
 * POST /api/admin/shipments/ekart/manifest
 * Download manifest for Ekart shipment(s)
 */
export async function POST(req) {
  try {
    await connectDB();
    const { orderId, trackingIds } = await req.json();

    let idsToDownload = [];

    // If orderId is provided, fetch tracking ID from order
    if (orderId) {
      const order = await Order.findOne({ orderId });
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const trackingId = order.ekart?.trackingId || order.trackingId;
      if (!trackingId) {
        return NextResponse.json(
          { error: "No Ekart tracking ID found for this order" },
          { status: 400 }
        );
      }

      idsToDownload = [trackingId];
    } else if (trackingIds && Array.isArray(trackingIds)) {
      idsToDownload = trackingIds;
    } else {
      return NextResponse.json(
        { error: "Either orderId or trackingIds array is required" },
        { status: 400 }
      );
    }

    console.log("📦 Downloading Ekart manifest for:", idsToDownload);

    // Download manifest from Ekart
    const manifestResponse = await ekartAPI.downloadManifest(idsToDownload);

    // Check for manifest URL in response
    const manifestUrl =
      manifestResponse.manifestDownloadUrl ||
      manifestResponse.manifest_url ||
      manifestResponse.downloadUrl;

    if (!manifestUrl) {
      return NextResponse.json(
        {
          error: "Failed to generate manifest",
          details: manifestResponse,
          message: "Manifest URL not found in response",
        },
        { status: 500 }
      );
    }

    // Update order with manifest URL if single order
    if (orderId) {
      await Order.findOneAndUpdate(
        { orderId },
        {
          "ekart.manifestUrl": manifestUrl,
          $push: {
            statusHistory: {
              status: "Manifest Generated",
              updatedAt: new Date(),
              note: "Ekart manifest downloaded",
            },
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Manifest generated successfully",
      manifestUrl: manifestUrl,
      manifestNumber: manifestResponse.manifestNumber,
      trackingIds: idsToDownload,
      // Return the URL for direct download
      downloadUrl: manifestUrl,
    });
  } catch (error) {
    console.error("❌ Ekart manifest error:", error);
    return NextResponse.json(
      {
        error: "Failed to download manifest",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
