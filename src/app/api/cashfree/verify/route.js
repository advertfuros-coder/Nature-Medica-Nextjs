import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { orderId } = await req.json();

  try {
    // Determine API URL based on environment
    const isProduction = process.env.CASHFREE_ENV === "PRODUCTION";
    const apiUrl = isProduction 
      ? `https://api.cashfree.com/pg/orders/${orderId}/payments`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`;

    console.log(`🔍 Verifying payment for order: ${orderId}`);
    console.log(`🌐 Environment: ${isProduction ? 'PRODUCTION' : 'TEST'}`);

    // Verify payment with Cashfree API
    const res = await axios.get(
      apiUrl,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const payments = res.data;
    
    // Check if there's a successful payment
    const successfulPayment = payments.find(
      (p) => p.payment_status === "SUCCESS"
    );

    if (successfulPayment) {
      console.log(`✅ Payment verified successfully: ${successfulPayment.cf_payment_id}`);
      return NextResponse.json({
        success: true,
        status: "SUCCESS",
        payment: successfulPayment,
        message: "Payment verified successfully"
      });
    }

    // Check for failed payments
    const failedPayment = payments.find(
      (p) => p.payment_status === "FAILED"
    );

    if (failedPayment) {
      console.log(`❌ Payment failed: ${failedPayment.cf_payment_id}`);
      return NextResponse.json({
        success: false,
        status: "FAILED",
        payment: failedPayment,
        message: "Payment failed"
      });
    }

    // Payment is still pending
    console.log(`⏳ Payment pending for order: ${orderId}`);
    return NextResponse.json({ 
      success: false, 
      status: "PENDING", 
      payments,
      message: "Payment is pending"
    });
    
  } catch (err) {
    console.error("❌ Cashfree Verify Error:", err.response?.data || err.message);
    return NextResponse.json({ 
      success: false,
      error: "Payment verification failed",
      details: err.response?.data || err.message 
    }, { status: 500 });
  }
}
