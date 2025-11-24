import { NextResponse } from "next/server";

const PHONEPE_ENV = process.env.PHONEPE_ENV || "sandbox";
const PHONEPE_HOST =
  PHONEPE_ENV === "production"
    ? "https://api.phonepe.com/apis/hermes"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox";

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";

// Helper to get Access Token (OAuth V2)
async function getAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "Missing PhonePe Credentials (PHONEPE_CLIENT_ID or PHONEPE_CLIENT_SECRET)"
    );
  }

  console.log("PhonePe OAuth Token Request:", {
    env: PHONEPE_ENV,
    host: PHONEPE_HOST,
    clientId: CLIENT_ID,
    hasSecret: !!CLIENT_SECRET,
    version: CLIENT_VERSION,
  });

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_version", CLIENT_VERSION);
  params.append("client_secret", CLIENT_SECRET);
  params.append("grant_type", "client_credentials");

  const response = await fetch(`${PHONEPE_HOST}/v1/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PhonePe Token Error:", errorText);
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const data = await response.json();
  console.log("✅ Access token obtained successfully");
  return data.access_token;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, orderId, customerPhone, customerEmail } = body;

    // 1. Get Access Token
    const accessToken = await getAccessToken();

    // 2. Prepare Payment Request (PG Checkout V2)
    const amountInPaise = Math.round(amount * 100);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ;
    const redirectUrl = `${baseUrl}/api/phonepe/callback?orderId=${orderId}`;

    const payload = {
      merchantOrderId: orderId,
      amount: amountInPaise,
      expireAfter: 1200, // 20 minutes
      metaInfo: {
        udf1: customerEmail || "",
        udf2: customerPhone || "",
        udf3: orderId,
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: `Payment for Order ${orderId}`,
        merchantUrls: {
          redirectUrl: redirectUrl,
        },
      },
    };

    console.log("PhonePe Pay Request:", {
      orderId,
      amount: amountInPaise,
      redirectUrl,
    });

    // 3. Initiate Payment (V2 Checkout)
    const payResponse = await fetch(`${PHONEPE_HOST}/checkout/v2/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!payResponse.ok) {
      const errorText = await payResponse.text();
      console.error("PhonePe Pay Error:", errorText);
      throw new Error(`Payment initiation failed: ${errorText}`);
    }

    const payData = await payResponse.json();
    console.log("✅ Payment initiated successfully:", payData.orderId);

    // The response contains a redirectUrl where we should send the user
    return NextResponse.json({
      success: true,
      redirectUrl: payData.redirectUrl,
      orderId: payData.orderId,
    });
  } catch (error) {
    console.error("PhonePe Error:", error);
    return NextResponse.json(
      { error: error.message || "Payment initiation failed" },
      { status: 500 }
    );
  }
}
