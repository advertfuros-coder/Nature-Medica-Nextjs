import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ekartAPI from "@/lib/ekart";

/**
 * POST /api/admin/ekart/estimate
 * Get shipping cost estimate for an order
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

    // Prepare estimate request data for Ekart
    const estimateData = {
      // Pickup location (seller)
      pickupPincode: parseInt(process.env.EKART_PICKUP_PINCODE || "400001"), // Mumbai default

      // Delivery location
      deliveryPincode: parseInt(order.shippingAddress.pincode),

      // Payment mode
      payment_mode: "Prepaid",

      // Package details - use custom values
      weight: dimensions.weight, // in kg
      length: dimensions.length, // in cm
      width: dimensions.width,
      height: dimensions.height,

      // Order value
      cod_amount: 0, // Prepaid shipment
      invoice_value: order.finalPrice,
    };

    console.log("💰 Requesting Ekart estimate for order:", orderId);
    console.log("📦 Estimate params:", estimateData);

    // Get estimate from Ekart
    const estimateResponse = await ekartAPI.getEstimate(estimateData);

    console.log("✅ Ekart estimate received:", estimateResponse);

    // Extract pricing information
    // Note: Response structure may vary, adjust based on actual Ekart API response
    const estimate = {
      shippingCost:
        estimateResponse.rate || estimateResponse.total_charges || 0,
      baseCharge: estimateResponse.base_charge || 0,
      fuelSurcharge: estimateResponse.fuel_surcharge || 0,
      gst: estimateResponse.gst || 0,
      totalCharge: estimateResponse.total_charges || estimateResponse.rate || 0,
      currency: "INR",
      estimatedDeliveryDays:
        estimateResponse.estimated_delivery_days ||
        estimateResponse.sla ||
        null,
      vendor: estimateResponse.vendor || "EKART",
      rawResponse: estimateResponse, // Include full response for debugging
    };

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      estimate,
      orderDetails: {
        value: order.finalPrice,
        weight: dimensions.weight,
        dimensions: {
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.height,
        },
        destination: {
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode,
        },
      },
    });
  } catch (error) {
    console.error("❌ Ekart estimate error:", error);

    // Check if it's an Ekart API error
    const ekartError = error.response?.data;

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

    return NextResponse.json(
      {
        error: "Failed to get shipping estimate",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
