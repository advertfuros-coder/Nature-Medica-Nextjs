import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req) {
  const { total, address, items, email, orderId, isPartialCOD, codBalance } =
    await req.json();

  // Check if credentials are available
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    console.error("❌ Cashfree credentials not found in environment variables");
    return NextResponse.json(
      { error: "Payment gateway not configured. Please contact support." },
      { status: 500 }
    );
  }

  const customerId =
    (email?.split("@")[0] || "guest").replace(/[^a-zA-Z0-9_-]/g, "") +
    "_" +
    Date.now();

  // Create unique Cashfree order ID by adding timestamp
  // This prevents "order already exists" error on retries
  const cashfreeOrderId = `${orderId}_${Date.now()}`;

  // Determine API URL based on environment
  const isProduction = process.env.CASHFREE_ENV === "PRODUCTION";
  const apiUrl = isProduction
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";

  // Create order note with partial COD info if applicable
  let orderNote = `Internal Order ID: ${orderId}`;
  if (isPartialCOD) {
    orderNote += ` | Partial COD - Advance: ₹${total}, Balance on Delivery: ₹${codBalance}`;
  }

  const payload = {
    order_id: cashfreeOrderId, // Use unique ID for Cashfree
    order_amount: total,
    order_currency: "INR",
    customer_details: {
      customer_id: customerId,
      customer_phone: address.phone,
      customer_name: address.name,
      customer_email: email || `${customerId}@guest.com`,
    },
    order_meta: {
      return_url: `${(process.env.NEXT_PUBLIC_APP_URL || "").replace(
        "http://",
        "https://"
      )}/payment/status?order_id=${cashfreeOrderId}&internal_order_id=${orderId}`,
      // Store original order ID in notes for reference
      notify_url: process.env.CASHFREE_WEBHOOK_URL || "",
    },
    order_note: orderNote,
  };

  console.log(
    `🔐 Cashfree Environment: ${isProduction ? "PRODUCTION" : "TEST"}`
  );
  console.log(`🌐 API URL: ${apiUrl}`);
  console.log(
    `📦 Creating payment session for order: ${orderId} (Cashfree ID: ${cashfreeOrderId})`
  );

  try {
    const res = await axios.post(apiUrl, payload, {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
    });

    console.log(
      `✅ Payment session created successfully: ${res.data.payment_session_id}`
    );

    return NextResponse.json({
      payment_session_id: res.data.payment_session_id,
      order_id: cashfreeOrderId, // Return Cashfree order ID
      internal_order_id: orderId, // Return original order ID
      mode: isProduction ? "production" : "sandbox", // Return mode for frontend
    });
  } catch (err) {
    console.error(
      "❌ Cashfree Session Error:",
      err.response?.data || err.message
    );
    console.error("API URL used:", apiUrl);
    console.error(
      "App ID (first 10 chars):",
      process.env.CASHFREE_APP_ID?.substring(0, 10) + "..."
    );

    return NextResponse.json(
      {
        error:
          "Failed to create payment session. Please try again or contact support.",
        details: err.response?.data?.message || err.message,
      },
      { status: 500 }
    );
  }
}
