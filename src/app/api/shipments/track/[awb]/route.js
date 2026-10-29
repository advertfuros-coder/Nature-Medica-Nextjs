import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { syncOrderTracking } from "@/lib/tracking-service";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const awb = resolvedParams.awb;

    console.log("🔍 Tracking request for AWB/Order:", awb);

    if (!awb) {
      return NextResponse.json({ error: "AWB or Order ID required" }, { status: 400 });
    }

    await connectDB();

    const cleanAwb = awb.trim();
    const caseInsensitive = new RegExp(`^${cleanAwb}$`, "i");

    // Find order in database
    let order = await Order.findOne({
      $or: [
        { trackingId: cleanAwb },
        { orderId: caseInsensitive },
        { "ekart.trackingId": cleanAwb },
        { ekartTrackingId: cleanAwb },
        { "shipmentTracking.awb": cleanAwb },
        { shiprocketOrderId: Number(cleanAwb) || -1 },
      ],
    });

    // If order found, attempt live sync if no scans or last sync older than 30 mins
    if (order) {
      const lastSync = order.shipmentTracking?.lastSyncAt
        ? new Date(order.shipmentTracking.lastSyncAt).getTime()
        : 0;
      const isStale = Date.now() - lastSync > 30 * 60 * 1000;
      const isDelivered = order.shipmentTracking?.isDelivered || order.orderStatus === "Delivered";

      if ((!order.shipmentTracking?.currentStatus || isStale) && !isDelivered) {
        try {
          const syncRes = await syncOrderTracking(order.orderId);
          if (syncRes.tracking) {
            order.shipmentTracking = syncRes.tracking;
          }
        } catch (syncErr) {
          console.warn("Public track live sync warning:", syncErr.message);
        }
      }

      const st = order.shipmentTracking || {};
      const trackingData = {
        provider: st.provider || order.shippingProvider || "Courier Partner",
        awb: st.awb || order.trackingId || order.ekart?.trackingId || awb,
        current_status: st.currentStatus || order.orderStatus || "In Transit",
        courier_name: st.courierPartner || order.courierName || "Express Courier",
        current_location: st.currentLocation || "In Transit",
        status_description: st.statusDescription || `Order status: ${order.orderStatus}`,
        is_delivered: st.isDelivered || order.orderStatus === "Delivered",
        is_rto: Boolean(st.isRTO),
        rto_reason: st.rtoReason || null,
        edd: st.estimatedDeliveryDate || order.estimatedDelivery || null,
        last_updated: st.lastSyncAt || order.updatedAt,
        activities: (st.scans && st.scans.length > 0)
          ? st.scans.map((s) => ({
              activity: s.activity,
              date: s.date,
              location: s.location,
              status_code: s.status,
            }))
          : (order.statusHistory || []).map((sh) => ({
              activity: sh.status,
              date: sh.updatedAt,
              location: sh.note || "Warehouse",
              status_code: sh.status,
            })).reverse(),
      };

      return NextResponse.json({
        success: true,
        tracking: trackingData,
        order: {
          orderId: order.orderId,
          orderDate: order.createdAt,
          customerName: order.shippingAddress?.name,
          customerEmail: order.userEmail,
          customerPhone: order.shippingAddress?.phone,
          status: order.orderStatus,
          items: (order.items || []).map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            variant: item.variant || "",
          })),
          totalAmount: order.finalPrice,
          shippingAddress: {
            street: order.shippingAddress?.street,
            city: order.shippingAddress?.city,
            state: order.shippingAddress?.state,
            pincode: order.shippingAddress?.pincode,
          },
        },
      });
    }

    // If order not found in DB, try live sync on the AWB directly
    try {
      const syncResult = await syncOrderTracking(awb);
      if (syncResult && syncResult.tracking) {
        const st = syncResult.tracking;
        return NextResponse.json({
          success: true,
          tracking: {
            provider: st.provider,
            awb: st.awb,
            current_status: st.currentStatus,
            courier_name: st.courierPartner,
            current_location: st.currentLocation,
            is_delivered: st.isDelivered,
            is_rto: st.isRTO,
            edd: st.estimatedDeliveryDate,
            activities: st.scans.map((s) => ({
              activity: s.activity,
              date: s.date,
              location: s.location,
              status_code: s.status,
            })),
          },
          order: {
            orderId: awb,
            orderDate: new Date(),
            customerName: "Customer",
            status: st.currentStatus,
            items: [],
            totalAmount: 0,
          },
        });
      }
    } catch (directSyncErr) {
      console.warn("Direct AWB tracking lookup failed:", directSyncErr.message);
    }

    return NextResponse.json(
      {
        error: "Order not found",
        message: "No order or tracking history found with this number. Please check the AWB and try again.",
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("❌ Track shipment error:", error);
    return NextResponse.json(
      { error: "Failed to track shipment", details: error.message },
      { status: 500 }
    );
  }
}
