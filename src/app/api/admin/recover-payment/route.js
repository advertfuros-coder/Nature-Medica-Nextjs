import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import axios from "axios";

// This endpoint helps recover payments that succeeded but order creation failed
export async function POST(req) {
  try {
    await connectDB();

    const { cashfreeOrderId, adminPassword } = await req.json();

    // Simple admin password check (replace with proper auth in production)
    if (adminPassword !== process.env.ADMIN_RECOVERY_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!cashfreeOrderId) {
      return NextResponse.json(
        { error: "Cashfree order ID is required" },
        { status: 400 }
      );
    }

    // Extract internal order ID from Cashfree order ID
    // Format: NM000085_1764660705883 -> NM000085
    const parts = cashfreeOrderId.split("_");
    const internalOrderId = parts[0];

    // Check if order already exists
    const existingOrder = await Order.findOne({ orderId: internalOrderId });
    if (existingOrder) {
      return NextResponse.json({
        message: "Order already exists",
        order: existingOrder,
      });
    }

    // Fetch payment details from Cashfree
    const isProduction = process.env.CASHFREE_ENV === "PRODUCTION";
    const apiUrl = isProduction
      ? `https://api.cashfree.com/pg/orders/${cashfreeOrderId}/payments`
      : `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}/payments`;

    const paymentsRes = await axios.get(apiUrl, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
    });

    const payments = paymentsRes.data;
    const successfulPayment = payments.find(
      (p) => p.payment_status === "SUCCESS"
    );

    if (!successfulPayment) {
      return NextResponse.json(
        {
          error: "No successful payment found for this order ID",
          payments,
        },
        { status: 404 }
      );
    }

    // Get order details from Cashfree
    const orderRes = await axios.get(
      isProduction
        ? `https://api.cashfree.com/pg/orders/${cashfreeOrderId}`
        : `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const cashfreeOrder = orderRes.data;

    return NextResponse.json({
      success: true,
      message: "Payment found in Cashfree. Manual order creation required.",
      internalOrderId,
      cashfreeOrderId,
      payment: successfulPayment,
      orderDetails: cashfreeOrder,
      instructions: [
        "1. Contact the customer using the phone/email from Cashfree",
        "2. Get order details (products, shipping address)",
        "3. Create order manually in database with orderId: " + internalOrderId,
        '4. Set paymentStatus: "paid"',
        "5. Set cashfreeOrderId and cashfreePaymentId",
        '6. Add note: "Order recovered from failed payment"',
      ],
    });
  } catch (error) {
    console.error("Payment recovery error:", error);
    return NextResponse.json(
      {
        error: "Failed to recover payment",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
