import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/middleware/auth";
import { syncOrderTracking } from "@/lib/tracking-service";

/**
 * GET /api/admin/orders/[orderId]/tracking
 * Get real-time tracking details for an order.
 * Query param: ?sync=true to force a live fetch from Ekart or Shiprocket API.
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId } = await params;
    const { searchParams } = new URL(req.url);
    const forceSync = searchParams.get("sync") === "true";

    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if tracking exists
    const hasTracking =
      Boolean(order.shipmentTracking?.awb) ||
      Boolean(order.trackingId) ||
      Boolean(order.ekart?.trackingId) ||
      Boolean(order.ekartTrackingId);

    if (!hasTracking) {
      return NextResponse.json({
        success: true,
        hasTracking: false,
        message: "No tracking assigned to this order yet",
        orderId,
      });
    }

    // If force sync requested or no tracking details yet, run syncOrderTracking
    if (forceSync || !order.shipmentTracking?.currentStatus) {
      try {
        const syncResult = await syncOrderTracking(orderId);
        return NextResponse.json({
          success: true,
          hasTracking: true,
          synced: true,
          tracking: syncResult.tracking,
          orderId,
        });
      } catch (syncErr) {
        console.warn("Live sync warning:", syncErr.message);
        // If live fetch fails (e.g., courier server rate limit or credentials), return cached if present
        if (order.shipmentTracking?.currentStatus) {
          return NextResponse.json({
            success: true,
            hasTracking: true,
            synced: false,
            syncWarning: syncErr.message,
            tracking: order.shipmentTracking,
            orderId,
          });
        }
        return NextResponse.json(
          {
            error: "Tracking sync failed",
            details: syncErr.message,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      hasTracking: true,
      synced: false,
      tracking: order.shipmentTracking,
      orderId,
    });
  } catch (error) {
    console.error("Admin order tracking API error:", error);
    if (
      error.message === "Admin access required" ||
      error.message === "Authentication required"
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch tracking details", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/orders/[orderId]/tracking
 * Manually update or override tracking details (useful for manual couriers)
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId } = await params;
    const body = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const {
      awb,
      courierPartner,
      currentStatus,
      currentLocation,
      statusDescription,
      isRTO,
      rtoReason,
    } = body;

    if (!order.shipmentTracking) {
      order.shipmentTracking = {};
    }

    if (awb) order.shipmentTracking.awb = awb;
    if (courierPartner) order.shipmentTracking.courierPartner = courierPartner;
    if (currentStatus) order.shipmentTracking.currentStatus = currentStatus;
    if (currentLocation) order.shipmentTracking.currentLocation = currentLocation;
    if (statusDescription)
      order.shipmentTracking.statusDescription = statusDescription;
    if (isRTO !== undefined) order.shipmentTracking.isRTO = isRTO;
    if (rtoReason) order.shipmentTracking.rtoReason = rtoReason;

    order.shipmentTracking.lastSyncAt = new Date();

    // Add manual scan entry
    if (currentLocation || statusDescription) {
      order.shipmentTracking.scans = order.shipmentTracking.scans || [];
      order.shipmentTracking.scans.unshift({
        date: new Date(),
        location: currentLocation || "Manual Entry",
        activity: statusDescription || `Status set to ${currentStatus}`,
        status: currentStatus || "IN_TRANSIT",
      });
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Tracking updated successfully",
      tracking: order.shipmentTracking,
    });
  } catch (error) {
    console.error("Manual tracking update error:", error);
    return NextResponse.json(
      { error: "Failed to update tracking", details: error.message },
      { status: 500 }
    );
  }
}
