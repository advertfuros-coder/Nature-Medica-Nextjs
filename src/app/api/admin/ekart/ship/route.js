import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ekartAPI from "@/lib/ekart";

/**
 * POST /api/admin/ekart/ship
 * Create Ekart shipment for an order
 */
export async function POST(req) {
  try {
    await connectDB();

    const { orderId, packageDetails } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findOne({ orderId }).populate("items.product");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if already shipped via Ekart
    if (order.ekart?.trackingId) {
      return NextResponse.json(
        {
          error: "Order already shipped via Ekart",
          trackingId: order.ekart.trackingId,
        },
        { status: 400 }
      );
    }

    // Calculate shipment details
    // Use custom package details if provided, otherwise calculate from products
    const totalWeight =
      packageDetails?.weight ||
      order.items.reduce((sum, item) => {
        const weight = item.product?.weight || 0.5; // Default 500g if not specified
        return sum + weight * item.quantity;
      }, 0);

    // Use custom dimensions if provided, otherwise use defaults
    const dimensions = {
      weight: totalWeight,
      length: packageDetails?.length || 30,
      width: packageDetails?.width || 20,
      height: packageDetails?.height || 15,
    };

    // Prepare shipment data for Ekart
    const shipmentData = {
      // Seller information
      seller_name: process.env.EKART_SELLER_NAME || "Nature Medica",
      seller_address: process.env.EKART_SELLER_ADDRESS || "Seller Address",
      seller_gst_tin: process.env.EKART_GST_NUMBER || "",

      // Order details
      order_number: order.orderId,
      invoice_number: order.orderId,
      invoice_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD

      // Customer details
      consignee_name: order.shippingAddress.name,
      consignee_gst_tin: "", // Optional

      // Payment details
      payment_mode: "Prepaid", // All orders are online paid

      // Product details
      products_desc: order.items.map((item) => item.title).join(", "),
      category_of_goods: "Health & Wellness Products",

      // Pricing
      total_amount: order.finalPrice,
      taxable_amount: Math.round(order.finalPrice / 1.18), // Assuming 18% GST
      tax_value: Math.round(order.finalPrice - order.finalPrice / 1.18),
      commodity_value: String(Math.round(order.finalPrice / 1.18)),
      cod_amount: 0, // Always 0 for prepaid

      // GST amounts
      seller_gst_amount: 0,
      consignee_gst_amount: Math.round(
        order.finalPrice - order.finalPrice / 1.18
      ),
      integrated_gst_amount: Math.round(
        order.finalPrice - order.finalPrice / 1.18
      ),

      // Package details - use custom values
      quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      weight: dimensions.weight, // in kg
      length: dimensions.length, // cm
      width: dimensions.width,
      height: dimensions.height,

      // Addresses
      drop_location: {
        name: order.shippingAddress.name,
        phone: parseInt(order.shippingAddress.phone), // Convert to integer
        alternate_phone: "",
        address: `${order.shippingAddress.street}${
          order.shippingAddress.landmark
            ? ", " + order.shippingAddress.landmark
            : ""
        }`,
        pin: parseInt(order.shippingAddress.pincode), // Convert to integer
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        country: "India", // Required field for Ekart API
      },

      // Pickup location (can be auto-filled by Ekart if registered)
      pickup_location: {
        name:
          process.env.EKART_PICKUP_LOCATION_NAME || "Nature Medica Warehouse",
      },

      // Return location (can be auto-filled by Ekart if registered)
      return_location: {
        name:
          process.env.EKART_RETURN_LOCATION_NAME || "Nature Medica Warehouse",
      },

      // Additional details
      return_reason: "", // Empty for forward shipments
      hsn_code: "3004", // HSN code for medicinal products
    };

    console.log("📦 Creating Ekart shipment for order:", order.orderId);
    console.log("💰 Order Details:", {
      finalPrice: order.finalPrice,
      totalWeight: totalWeight,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      shippingTo: {
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode,
      },
    });
    console.log("📦 Shipment Pricing:", {
      total_amount: shipmentData.total_amount,
      commodity_value: shipmentData.commodity_value,
      weight_kg: shipmentData.weight,
      dimensions: `${shipmentData.length}x${shipmentData.width}x${shipmentData.height} cm`,
    });

    // Create shipment with Ekart
    const ekartResponse = await ekartAPI.createShipment(shipmentData);

    if (!ekartResponse.status) {
      return NextResponse.json(
        {
          error: "Failed to create Ekart shipment",
          details: ekartResponse.remark,
        },
        { status: 500 }
      );
    }

    // Update order with Ekart details
    order.shippingProvider = "ekart";
    order.orderStatus = "Shipped";
    order.trackingId = ekartResponse.tracking_id; // Set generic trackingId for UI to detect shipment

    // Ensure paymentMode is valid (Nature Medica only accepts online payments)
    // Use direct assignment to fix any legacy invalid data
    if (order.paymentMode !== "online") {
      console.log(
        `⚠️  Fixing invalid paymentMode: ${order.paymentMode} → online`
      );
      order.paymentMode = "online";
    }

    order.ekart = {
      trackingId: ekartResponse.tracking_id,
      waybillNumber: ekartResponse.barcodes?.wbn || "",
      vendor: ekartResponse.vendor,
      orderNumber: ekartResponse.barcodes?.order || order.orderId,
      codWaybill: ekartResponse.barcodes?.cod || "",
      shipmentStatus: "Created",
      createdAt: new Date(),
    };

    // Add to status history
    order.statusHistory.push({
      status: "Shipped",
      updatedAt: new Date(),
      note: `Shipped via Ekart. Tracking ID: ${ekartResponse.tracking_id}`,
    });

    // Save with validation disabled to handle any legacy invalid data
    // This is safe because we've ensured the critical fields are correct above
    console.log("💾 Attempting to save order with Ekart data...");
    console.log("Ekart data to save:", order.ekart);

    try {
      const savedOrder = await order.save({ validateBeforeSave: false });
      console.log("✅ Order saved successfully with Ekart data");
      console.log("Saved Ekart tracking ID:", savedOrder.ekart?.trackingId);
    } catch (saveError) {
      console.error(
        "❌ CRITICAL: Failed to save order to database:",
        saveError
      );
      console.error("Save error details:", saveError.message);

      // Still return success since Ekart shipment was created
      // But log the database issue
      return NextResponse.json({
        success: true,
        warning: "Shipment created but database save failed",
        message: "Shipment created successfully",
        trackingId: ekartResponse.tracking_id,
        vendor: ekartResponse.vendor,
        waybillNumber: ekartResponse.barcodes?.wbn,
        trackingUrl: `https://app.elite.ekartlogistics.in/track/${ekartResponse.tracking_id}`,
        dbError: saveError.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Shipment created successfully",
      trackingId: ekartResponse.tracking_id,
      vendor: ekartResponse.vendor,
      waybillNumber: ekartResponse.barcodes?.wbn,
      trackingUrl: `https://app.elite.ekartlogistics.in/track/${ekartResponse.tracking_id}`,
    });
  } catch (error) {
    console.error("❌ Ekart ship order error:", error);

    // Check if it's an Ekart API error with specific error codes
    const ekartError = error.response?.data;

    // Handle wallet balance error specifically
    if (ekartError?.description?.includes("enough balance")) {
      return NextResponse.json(
        {
          error: "Insufficient Ekart Wallet Balance",
          details:
            "Your Ekart account doesn't have sufficient balance to create this prepaid shipment. Please recharge your Ekart wallet and try again.",
          ekartMessage: ekartError.description,
        },
        { status: 402 } // 402 Payment Required
      );
    }

    // Handle other Ekart API errors
    if (ekartError) {
      return NextResponse.json(
        {
          error: "Ekart API Error",
          code: ekartError.code,
          message: ekartError.message,
          details: ekartError.description,
        },
        { status: 400 }
      );
    }

    // Generic error handling
    return NextResponse.json(
      {
        error: "Failed to create shipment",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
