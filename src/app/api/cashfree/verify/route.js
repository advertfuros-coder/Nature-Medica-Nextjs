import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { orderId } = await req.json();

  try {
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

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("Verify Error:", err.response?.data || err.message);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
