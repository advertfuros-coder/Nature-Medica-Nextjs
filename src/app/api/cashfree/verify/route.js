import { NextResponse } from "next/server";
import axios from "axios";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  const { orderId } = await req.json();

  try {
    await connectDB();

    const res = await axios.get(
      `https://api.cashfree.com/pg/orders/${orderId}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const payments = res.data;
    const successfulPayment = payments.find(
      (p) => p.payment_status === "SUCCESS"
    );

    if (successfulPayment) {
      await Order.findOneAndUpdate(
        { orderId: orderId },
        {
          paymentStatus: "paid",
          $push: {
            statusHistory: {
              status: "Payment Received",
              updatedAt: new Date(),
              note: `Payment successful via Cashfree (Txn: ${successfulPayment.cf_payment_id})`,
            },
          },
        }
      );
      return NextResponse.json({
        success: true,
        status: "SUCCESS",
        payment: successfulPayment,
      });
    }

    return NextResponse.json({ success: false, status: "PENDING", payments });
  } catch (err) {
    console.error("Verify Error:", err.response?.data || err.message);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
