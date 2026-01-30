import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import ekartEliteService from "@/lib/ekart-elite";
import {
  getPaymentMode,
  getCODAmount,
  logPendingPaymentWarning,
} from "@/utils/payment-mode-helper";

export async function POST(req) {
  try {
    await connectDB();
    const { orderId, weight } = await req.json();

    console.log("📦 Creating Ekart Elite shipment for order:", orderId);

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if already shipped
    if (order.ekartTrackingId) {
      return NextResponse.json({
        success: true,
        message: "Ekart shipment already exists",
        trackingId: order.ekartTrackingId,
      });
    }

    // Check serviceability
    const originPincode = process.env.PICKUP_PINCODE || "226022";
    try {
      const serviceCheck = await ekartEliteService.checkServiceability(
        originPincode,
        order.shippingAddress.pincode,
        weight || 0.5,
      );

      if (!serviceCheck.serviceable) {
        return NextResponse.json(
          {
            error: `Ekart doesn't service pincode: ${order.shippingAddress.pincode}`,
            suggestion: "Try Shiprocket instead",
          },
          { status: 400 },
        );
      }
    } catch (error) {
      console.warn("⚠️ Serviceability check skipped:", error.message);
    }

    // Determine payment mode based on actual payment status
    // COD if: explicitly COD OR partial COD OR online payment not completed (fallback scenario)
    const paymentMode = getPaymentMode(order);
    const amountToCollect = getCODAmount(order);

    // Log warning for pending online payments
    logPendingPaymentWarning(order);

    // Prepare shipment data
    const shipmentData = {
      reference_id: order.orderId,
      goods_category: "NON_ESSENTIAL",
      delivery_type: "SMALL",
      service_type: "FORWARD",
      amount_to_collect: amountToCollect,
      source: {
        address: {
          first_name: process.env.BUSINESS_NAME || "Nature Medica",
          phone: process.env.PICKUP_PHONE || "8400043322",
          email: process.env.PICKUP_EMAIL || "naturemedica09@gmail.com",
          address_line_1: process.env.PICKUP_ADDRESS,
          city: process.env.PICKUP_CITY || "Lucknow",
          state: process.env.PICKUP_STATE || "Uttar Pradesh",
          pincode: originPincode,
        },
      },
      destination: {
        address: {
          first_name: order.shippingAddress.name,
          phone: order.shippingAddress.phone,
          email: order.userEmail,
          address_line_1: order.shippingAddress.street,
          address_line_2: order.shippingAddress.landmark || "",
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode,
        },
      },
      package_details: {
        length: 10,
        breadth: 10,
        height: 10,
        weight: weight || 0.5,
      },
      item_details: order.items.map((item) => ({
        name: item.title,
        quantity: item.quantity,
        price: item.price,
        hsn_code: "",
      })),
      invoice_details: {
        invoice_number: order.orderId,
        invoice_date: new Date(order.createdAt).toISOString().split("T")[0],
        invoice_value: order.finalPrice,
      },
    };

    console.log("📤 Creating Ekart shipment...");

    // Create shipment
    const response = await ekartEliteService.createShipment(shipmentData);

    if (!response.success) {
      throw new Error(response.message || "Failed to create shipment");
    }

    const trackingId = response.tracking_id || response.reference_id;

    console.log("✅ Ekart shipment created:", trackingId);

    // Update order
    await Order.findByIdAndUpdate(order._id, {
      ekartTrackingId: trackingId,
      ekartReferenceId: order.orderId,
      trackingId: trackingId,
      courierName: "Ekart Logistics",
      orderStatus: "Shipped",
      $push: {
        statusHistory: {
          status: "Shipped",
          updatedAt: new Date(),
          note: `Ekart shipment created - Tracking: ${trackingId}`,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Ekart shipment created successfully!",
      trackingId: trackingId,
      awb: response.awb_number,
    });
  } catch (error) {
    console.error("❌ Ekart shipment error:", error);
    return NextResponse.json(
      {
        error: "Failed to create Ekart shipment",
        details: error.message,
        suggestion:
          "Please contact Account Manager: Vivek - vivekkumar27.vc@flipkart.com",
      },
      { status: 500 },
    );
  }
}
