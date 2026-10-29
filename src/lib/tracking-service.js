import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import ekartAPI from "@/lib/ekart";
import shiprocketService from "@/lib/shiprocket";

/**
 * Standard Status Categories:
 * - 'MANIFESTED'
 * - 'PICKED_UP'
 * - 'IN_TRANSIT'
 * - 'OUT_FOR_DELIVERY'
 * - 'DELIVERED'
 * - 'NDR' (Non-Delivery Report / Delivery Attempt Failed)
 * - 'RTO_IN_TRANSIT' (Returning to origin / warehouse)
 * - 'RTO_DELIVERED' (Safely returned to warehouse)
 * - 'CANCELLED'
 */

export function normalizeShiprocketStatus(statusString) {
  if (!statusString) return "IN_TRANSIT";
  const s = statusString.toUpperCase().trim();

  if (s.includes("DELIVERED") && !s.includes("RTO")) {
    return "DELIVERED";
  }
  if (s.includes("RTO DELIVERED") || s.includes("RETURN DELIVERED")) {
    return "RTO_DELIVERED";
  }
  if (
    s.includes("RTO") ||
    s.includes("RETURN INITIATED") ||
    s.includes("RETURNING")
  ) {
    return "RTO_IN_TRANSIT";
  }
  if (s.includes("OUT FOR DELIVERY") || s.includes("OFD")) {
    return "OUT_FOR_DELIVERY";
  }
  if (
    s.includes("UNDELIVERED") ||
    s.includes("FAILED") ||
    s.includes("EXCEPTION") ||
    s.includes("UNREACHABLE") ||
    s.includes("DELAYED")
  ) {
    return "NDR";
  }
  if (
    s.includes("PICKED UP") ||
    s.includes("PICKUP COMPLETE") ||
    s.includes("PICKED_UP")
  ) {
    return "PICKED_UP";
  }
  if (
    s.includes("MANIFEST") ||
    s.includes("AWB ASSIGNED") ||
    s.includes("LABEL GENERATED") ||
    s.includes("PICKUP SCHEDULED") ||
    s.includes("CREATED")
  ) {
    return "MANIFESTED";
  }
  if (s.includes("CANCEL") || s.includes("LOST") || s.includes("DAMAGED")) {
    return "CANCELLED";
  }

  return "IN_TRANSIT";
}

export function normalizeEkartStatus(statusString) {
  if (!statusString) return "IN_TRANSIT";
  const s = statusString.toUpperCase().trim();

  if (s.includes("DELIVERED") && !s.includes("RTO")) {
    return "DELIVERED";
  }
  if (s.includes("RTO DELIVERED") || s.includes("RETURNED")) {
    return "RTO_DELIVERED";
  }
  if (s.includes("RTO") || s.includes("RETURN")) {
    return "RTO_IN_TRANSIT";
  }
  if (s.includes("OUT FOR DELIVERY") || s.includes("OUT_FOR_DELIVERY")) {
    return "OUT_FOR_DELIVERY";
  }
  if (
    s.includes("UNDELIVERED") ||
    s.includes("ATTEMPT") ||
    s.includes("REFUSED") ||
    s.includes("FAILED")
  ) {
    return "NDR";
  }
  if (s.includes("PICKED UP") || s.includes("PICKED_UP") || s.includes("PICKUP_COMPLETE")) {
    return "PICKED_UP";
  }
  if (
    s.includes("CREATED") ||
    s.includes("MANIFESTED") ||
    s.includes("SCHEDULED") ||
    s.includes("PENDING")
  ) {
    return "MANIFESTED";
  }
  if (s.includes("CANCEL")) {
    return "CANCELLED";
  }

  return "IN_TRANSIT";
}

/**
 * Sync live tracking for an order by orderId, order _id, or AWB
 */
export async function syncOrderTracking(identifier) {
  await connectDB();

  // Find order by orderId, trackingId, ekart trackingId, or MongoDB _id
  let order = await Order.findOne({
    $or: [
      { orderId: identifier },
      { trackingId: identifier },
      { "ekart.trackingId": identifier },
      { "shipmentTracking.awb": identifier },
      { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
    ].filter(Boolean),
  });

  if (!order) {
    throw new Error(`Order not found for identifier: ${identifier}`);
  }

  // Detect provider
  const hasEkart = Boolean(
    order.ekart?.trackingId ||
      order.ekartTrackingId ||
      order.shippingProvider === "ekart"
  );
  const ekartTrackingId = order.ekart?.trackingId || order.ekartTrackingId;

  const hasShiprocket = Boolean(
    order.shiprocketOrderId ||
      order.shiprocketShipmentId ||
      order.shippingProvider === "shiprocket"
  );
  const generalAwb = order.trackingId || order.shipmentTracking?.awb;

  let provider = order.shipmentTracking?.provider || order.shippingProvider;
  if (!provider || provider === "manual") {
    if (hasEkart) provider = "ekart";
    else if (hasShiprocket) provider = "shiprocket";
    else if (generalAwb) provider = "shiprocket";
  }

  let normalizedTracking = null;

  if (provider === "ekart" && ekartTrackingId) {
    normalizedTracking = await fetchAndNormalizeEkart(ekartTrackingId, order);
  } else if (generalAwb) {
    // Try shiprocket
    try {
      normalizedTracking = await fetchAndNormalizeShiprocket(generalAwb, order);
    } catch (err) {
      console.warn("Shiprocket live fetch failed, trying ekart as fallback:", err.message);
      if (ekartTrackingId) {
        normalizedTracking = await fetchAndNormalizeEkart(ekartTrackingId, order);
      } else {
        throw err;
      }
    }
  } else {
    throw new Error("No tracking number or AWB found for this order");
  }

  if (normalizedTracking) {
    await applyTrackingToOrder(order, normalizedTracking);
  }

  return {
    success: true,
    orderId: order.orderId,
    tracking: order.shipmentTracking,
  };
}

/**
 * Fetch and normalize Ekart live tracking
 */
async function fetchAndNormalizeEkart(trackingId, order) {
  const trackingData = await ekartAPI.trackShipment(trackingId);
  // trackingData typical response:
  // { status: 'Delivered', location: 'Mumbai', desc: '...', ctime: 1657523187604, history: [...] }
  const rawStatus = trackingData.status || trackingData.current_status || "In Transit";
  const normalizedStatus = normalizeEkartStatus(rawStatus);

  const rawLocation =
    trackingData.location ||
    trackingData.current_location ||
    trackingData.city ||
    "In Transit";

  // Scans history
  const historyList =
    trackingData.history ||
    trackingData.tracking_history ||
    trackingData.events ||
    [];

  let scans = historyList.map((item) => ({
    date: item.ctime
      ? new Date(item.ctime)
      : item.status_time
      ? new Date(item.status_time)
      : item.date
      ? new Date(item.date)
      : new Date(),
    location: item.location || item.city || "Hub",
    activity: item.desc || item.remarks || item.activity || item.status || "Status Update",
    status: item.status || rawStatus,
    statusCode: item.status_code || "",
  }));

  // If scans is empty, insert the current checkpoint
  if (scans.length === 0 && (rawStatus || rawLocation)) {
    scans.push({
      date: trackingData.ctime ? new Date(trackingData.ctime) : new Date(),
      location: rawLocation,
      activity: trackingData.desc || `Status: ${rawStatus}`,
      status: rawStatus,
      statusCode: "",
    });
  }

  // Sort scans latest first
  scans.sort((a, b) => new Date(b.date) - new Date(a.date));

  const isDelivered = normalizedStatus === "DELIVERED";
  const isRTO =
    normalizedStatus === "RTO_IN_TRANSIT" ||
    normalizedStatus === "RTO_DELIVERED";

  return {
    provider: "ekart",
    awb: trackingId,
    courierPartner: order.ekart?.vendor || "Ekart Logistics",
    currentStatus: normalizedStatus,
    statusCode: rawStatus,
    currentLocation: scans[0]?.location || rawLocation,
    statusDescription:
      trackingData.desc ||
      trackingData.status_message ||
      `Package is currently ${normalizedStatus.replace(/_/g, " ").toLowerCase()}`,
    isDelivered,
    deliveredAt: isDelivered ? new Date(trackingData.ctime || Date.now()) : null,
    isRTO,
    rtoInitiatedAt: isRTO ? new Date(trackingData.ctime || Date.now()) : null,
    rtoDeliveredAt:
      normalizedStatus === "RTO_DELIVERED"
        ? new Date(trackingData.ctime || Date.now())
        : null,
    rtoReason: trackingData.undelivered_reason || trackingData.rto_reason || "",
    estimatedDeliveryDate: trackingData.expected_date
      ? new Date(trackingData.expected_date)
      : null,
    scans,
    raw: trackingData,
  };
}

/**
 * Fetch and normalize Shiprocket live tracking
 */
async function fetchAndNormalizeShiprocket(awb, order) {
  const token = await shiprocketService.getToken();

  const response = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const shiprocketData = await response.json();
  if (!response.ok || !shiprocketData.tracking_data) {
    throw new Error(
      shiprocketData.message || "Failed to retrieve tracking data from Shiprocket"
    );
  }

  const trackData = shiprocketData.tracking_data;
  const shipmentTrack = trackData.shipment_track?.[0] || {};
  const activities = trackData.shipment_track_activities || [];

  const rawStatus =
    shipmentTrack.current_status ||
    trackData.shipment_status ||
    "In Transit";
  const normalizedStatus = normalizeShiprocketStatus(rawStatus);

  const courierName =
    shipmentTrack.courier_name ||
    order.courierName ||
    "Shiprocket Logistics";

  // Build scans
  const scans = activities.map((act) => ({
    date: act.date ? new Date(act.date) : new Date(),
    location: act.location || act["sr-scan-location"] || "Hub",
    activity: act.activity || act["sr-status-label"] || "Scanned",
    status: act["sr-status-label"] || act.status || rawStatus,
    statusCode: String(act["sr-status"] || ""),
  }));

  // Sort latest first
  scans.sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentLocation =
    scans[0]?.location ||
    shipmentTrack.destination ||
    shipmentTrack.origin ||
    "In Transit";

  const isDelivered = normalizedStatus === "DELIVERED";
  const isRTO =
    normalizedStatus === "RTO_IN_TRANSIT" ||
    normalizedStatus === "RTO_DELIVERED";

  return {
    provider: "shiprocket",
    awb,
    courierPartner: courierName,
    currentStatus: normalizedStatus,
    statusCode: rawStatus,
    currentLocation,
    statusDescription:
      scans[0]?.activity ||
      `Package status: ${normalizedStatus.replace(/_/g, " ").toLowerCase()}`,
    isDelivered,
    deliveredAt: isDelivered
      ? new Date(shipmentTrack.delivered_date || Date.now())
      : null,
    isRTO,
    rtoInitiatedAt: isRTO ? new Date() : null,
    rtoDeliveredAt:
      normalizedStatus === "RTO_DELIVERED" ? new Date() : null,
    rtoReason:
      shiprocketData.undelivered_reason ||
      shipmentTrack.undelivered_reason ||
      "",
    estimatedDeliveryDate:
      shipmentTrack.edd || trackData.edd
        ? new Date(shipmentTrack.edd || trackData.edd)
        : null,
    scans,
    raw: trackData,
  };
}

/**
 * Apply normalized tracking payload to Order document
 */
export async function applyTrackingToOrder(order, normalized) {
  if (!order.shipmentTracking) {
    order.shipmentTracking = {};
  }

  order.shipmentTracking.provider = normalized.provider;
  order.shipmentTracking.awb = normalized.awb;
  order.shipmentTracking.courierPartner = normalized.courierPartner;
  order.shipmentTracking.currentStatus = normalized.currentStatus;
  order.shipmentTracking.statusCode = normalized.statusCode;
  order.shipmentTracking.currentLocation = normalized.currentLocation;
  order.shipmentTracking.statusDescription = normalized.statusDescription;
  order.shipmentTracking.isDelivered = normalized.isDelivered;
  if (normalized.deliveredAt) {
    order.shipmentTracking.deliveredAt = normalized.deliveredAt;
  }
  order.shipmentTracking.isRTO = normalized.isRTO;
  if (normalized.isRTO && !order.shipmentTracking.rtoInitiatedAt) {
    order.shipmentTracking.rtoInitiatedAt =
      normalized.rtoInitiatedAt || new Date();
  }
  if (normalized.rtoDeliveredAt) {
    order.shipmentTracking.rtoDeliveredAt = normalized.rtoDeliveredAt;
  }
  if (normalized.rtoReason) {
    order.shipmentTracking.rtoReason = normalized.rtoReason;
  }
  if (normalized.estimatedDeliveryDate) {
    order.shipmentTracking.estimatedDeliveryDate =
      normalized.estimatedDeliveryDate;
  }
  order.shipmentTracking.lastSyncAt = new Date();

  // Deduplicate and merge scans
  const existingMap = new Map();
  (order.shipmentTracking.scans || []).forEach((s) => {
    const key = `${new Date(s.date).getTime()}_${s.location}_${s.activity}`;
    existingMap.set(key, s);
  });

  (normalized.scans || []).forEach((s) => {
    const key = `${new Date(s.date).getTime()}_${s.location}_${s.activity}`;
    if (!existingMap.has(key)) {
      existingMap.set(key, s);
    }
  });

  const mergedScans = Array.from(existingMap.values());
  mergedScans.sort((a, b) => new Date(b.date) - new Date(a.date));
  order.shipmentTracking.scans = mergedScans;

  // High-level orderStatus synchronization
  if (normalized.currentStatus === "DELIVERED") {
    if (order.orderStatus !== "Delivered") {
      order.orderStatus = "Delivered";
      order.statusHistory.push({
        status: "Delivered",
        updatedAt: new Date(),
        note: `Delivered by ${normalized.courierPartner} (AWB: ${normalized.awb})`,
      });
    }
    if (order.ekart) {
      order.ekart.deliveredAt = normalized.deliveredAt || new Date();
      order.ekart.shipmentStatus = "Delivered";
    }
  } else if (normalized.isRTO) {
    // Note: We flag isRTO = true, but keep orderStatus as 'Shipped' or note RTO to prevent corrupting completed sales
    const rtoNote = `RTO Alert: Package returning via ${normalized.courierPartner}. Reason: ${
      normalized.rtoReason || "Delivery failed"
    }`;
    const alreadyLogged = order.statusHistory.some((sh) =>
      sh.note?.includes("RTO Alert")
    );
    if (!alreadyLogged) {
      order.statusHistory.push({
        status: "Shipped",
        updatedAt: new Date(),
        note: rtoNote,
      });
    }
    if (order.ekart) {
      order.ekart.shipmentStatus = normalized.currentStatus;
    }
  } else if (
    ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(
      normalized.currentStatus
    )
  ) {
    if (order.orderStatus === "Pending" || order.orderStatus === "Processing") {
      order.orderStatus = "Shipped";
      order.statusHistory.push({
        status: "Shipped",
        updatedAt: new Date(),
        note: `Shipment in transit with ${normalized.courierPartner}`,
      });
    }
  }

  await order.save();
  return order;
}

/**
 * Handle incoming webhook payload (from Shiprocket or Ekart)
 */
export async function processShippingWebhook(payload, providerHint = null) {
  await connectDB();

  // 1. Ekart Webhook Detection
  // Ekart payloads usually have tracking_id or event: 'track_updated'
  if (
    providerHint === "ekart" ||
    payload.tracking_id ||
    payload.event === "track_updated"
  ) {
    const trackingId = payload.tracking_id || payload.data?.tracking_id;
    if (!trackingId) {
      return { success: false, message: "No tracking_id found in Ekart webhook" };
    }

    const order = await Order.findOne({
      $or: [
        { "ekart.trackingId": trackingId },
        { ekartTrackingId: trackingId },
        { trackingId: trackingId },
        { "shipmentTracking.awb": trackingId },
      ],
    });

    if (!order) {
      return { success: false, message: `Order not found for Ekart tracking ${trackingId}` };
    }

    const normalized = await fetchAndNormalizeEkart(trackingId, order);
    await applyTrackingToOrder(order, normalized);
    return { success: true, orderId: order.orderId, tracking: order.shipmentTracking };
  }

  // 2. Shiprocket Webhook Detection
  // Payload has awb, current_status, scans, order_id
  const awb = payload.awb || payload.data?.awb;
  const orderId = payload.order_id || payload.sr_order_id;

  if (awb || orderId) {
    const order = await Order.findOne({
      $or: [
        { trackingId: awb },
        { "shipmentTracking.awb": awb },
        { orderId: String(orderId) },
        { shiprocketOrderId: Number(orderId) || -1 },
      ].filter(Boolean),
    });

    if (!order) {
      return { success: false, message: `Order not found for AWB: ${awb}` };
    }

    // Direct extraction from webhook payload if available
    const rawStatus = payload.current_status || payload.shipment_status || "IN TRANSIT";
    const normalizedStatus = normalizeShiprocketStatus(rawStatus);
    const courierName = payload.courier_name || order.courierName || "Courier Partner";

    const scans = (payload.scans || []).map((s) => ({
      date: s.date ? new Date(s.date) : new Date(),
      location: s.location || s["sr-scan-location"] || "Hub",
      activity: s.activity || s["sr-status-label"] || "Checkpoint Scan",
      status: s["sr-status-label"] || s.status || rawStatus,
      statusCode: String(s["sr-status"] || ""),
    }));

    scans.sort((a, b) => new Date(b.date) - new Date(a.date));

    const currentLocation = scans[0]?.location || payload.location || "In Transit";
    const isDelivered = normalizedStatus === "DELIVERED";
    const isRTO =
      normalizedStatus === "RTO_IN_TRANSIT" ||
      normalizedStatus === "RTO_DELIVERED";

    const normalized = {
      provider: "shiprocket",
      awb: awb || order.trackingId,
      courierPartner: courierName,
      currentStatus: normalizedStatus,
      statusCode: rawStatus,
      currentLocation,
      statusDescription:
        scans[0]?.activity ||
        `Current status: ${normalizedStatus.replace(/_/g, " ").toLowerCase()}`,
      isDelivered,
      deliveredAt: isDelivered ? new Date() : null,
      isRTO,
      rtoInitiatedAt: isRTO ? new Date() : null,
      rtoDeliveredAt: normalizedStatus === "RTO_DELIVERED" ? new Date() : null,
      rtoReason: payload.undelivered_reason || "",
      estimatedDeliveryDate: payload.etd ? new Date(payload.etd) : null,
      scans,
    };

    await applyTrackingToOrder(order, normalized);
    return { success: true, orderId: order.orderId, tracking: order.shipmentTracking };
  }

  return { success: false, message: "Unrecognized webhook format" };
}

/**
 * Batch Auto-Sync Engine for all Active (In-Transit / Unfinished) Shipments
 * Automatically cycles through active orders to capture the next stage (e.g. In Transit -> Out for Delivery -> Delivered)
 */
let isAutoSyncRunning = false;

export async function syncAllActiveShipments({
  maxBatch = 25,
  staleThresholdMinutes = 20,
  force = false,
} = {}) {
  await connectDB();

  // Find candidate orders that are currently in progress
  const query = {
    $or: [
      { trackingId: { $exists: true, $nin: ["", null] } },
      { "ekart.trackingId": { $exists: true, $nin: ["", null] } },
      { "shipmentTracking.awb": { $exists: true, $nin: ["", null] } },
      { shiprocketOrderId: { $exists: true, $nin: [null, 0] } },
    ],
    orderStatus: { $nin: ["Delivered", "Cancelled"] },
    "shipmentTracking.isDelivered": { $ne: true },
    "shipmentTracking.currentStatus": { $nin: ["DELIVERED", "RTO_DELIVERED", "CANCELLED"] },
  };

  if (!force) {
    const cutoffDate = new Date(Date.now() - staleThresholdMinutes * 60 * 1000);
    query.$and = [
      {
        $or: [
          { "shipmentTracking.lastSyncAt": { $exists: false } },
          { "shipmentTracking.lastSyncAt": null },
          { "shipmentTracking.lastSyncAt": { $lte: cutoffDate } },
        ],
      },
    ];
  }

  const activeOrders = await Order.find(query)
    .sort({ "shipmentTracking.lastSyncAt": 1, updatedAt: 1 })
    .limit(maxBatch);

  console.log(`📦 Found ${activeOrders.length} active shipments to auto-sync.`);

  const results = [];
  let syncedCount = 0;
  let stageChangeCount = 0;

  for (const order of activeOrders) {
    const prevStatus = order.shipmentTracking?.currentStatus || order.orderStatus;
    const prevLocation = order.shipmentTracking?.currentLocation || "";

    try {
      // 300ms polite pause to avoid courier API rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = await syncOrderTracking(order.orderId);
      const newStatus = res.tracking?.currentStatus;
      const newLocation = res.tracking?.currentLocation;
      const stageChanged = prevStatus !== newStatus;

      if (stageChanged) {
        stageChangeCount++;
        console.log(`⚡ Stage Change for Order ${order.orderId}: ${prevStatus} ➔ ${newStatus} (${newLocation})`);
      }

      syncedCount++;
      results.push({
        orderId: order.orderId,
        awb: res.tracking?.awb,
        courier: res.tracking?.courierPartner,
        previousStatus: prevStatus,
        currentStatus: newStatus,
        currentLocation: newLocation,
        stageChanged,
        success: true,
      });
    } catch (orderErr) {
      console.warn(`⚠️ Could not auto-sync order ${order.orderId}:`, orderErr.message);
      results.push({
        orderId: order.orderId,
        success: false,
        error: orderErr.message,
      });
    }
  }

  return {
    success: true,
    totalFound: activeOrders.length,
    syncedCount,
    stageChangeCount,
    results,
    timestamp: new Date(),
  };
}

export async function runBackgroundAutoSync() {
  if (isAutoSyncRunning) {
    console.log("⏳ Background shipment sync is already in progress.");
    return { success: false, message: "Sync already in progress" };
  }

  try {
    isAutoSyncRunning = true;
    console.log("🚀 Running background auto-sync for active shipments...");
    const report = await syncAllActiveShipments({ maxBatch: 30, staleThresholdMinutes: 20 });
    console.log(
      `✅ Auto-sync completed: ${report.syncedCount}/${report.totalFound} synced. ${report.stageChangeCount} packages progressed to next stage.`
    );
    return report;
  } catch (error) {
    console.error("❌ Auto-sync runner error:", error);
    throw error;
  } finally {
    isAutoSyncRunning = false;
  }
}

