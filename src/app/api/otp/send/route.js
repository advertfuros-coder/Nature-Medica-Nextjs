import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    // Validate phone number
    if (!phone || !/^[6-9][0-9]{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number. Must be 10 digits starting with 6-9." },
        { status: 400 }
      );
    }

    // Check if Cashfree Verification credentials are available
    if (!process.env.CASHFREE_VERIFICATION_APP_ID || !process.env.CASHFREE_VERIFICATION_SECRET_KEY) {
      console.error("❌ Cashfree Verification API credentials not found");
      console.log("ℹ️ Please add CASHFREE_VERIFICATION_APP_ID and CASHFREE_VERIFICATION_SECRET_KEY to your .env file");
      console.log("ℹ️ Get these from: https://merchant.cashfree.com/verificationsuite/developers/api-keys");
      
      return NextResponse.json(
        { 
          error: "OTP service not configured. Please add Verification API credentials.",
          hint: "Add CASHFREE_VERIFICATION_APP_ID and CASHFREE_VERIFICATION_SECRET_KEY to .env file"
        },
        { status: 500 }
      );
    }

    // Determine API URL based on environment
    const isProduction = process.env.CASHFREE_ENV === "PRODUCTION";
    const apiUrl = isProduction
      ? "https://api.cashfree.com/verification/mobile360/otp/send"
      : "https://sandbox.cashfree.com/verification/mobile360/otp/send";

    // Generate unique verification ID
    const verificationId = `NM_${Date.now()}_${phone}`;

    const payload = {
      verification_id: verificationId,
      mobile_number: phone, // 10 digits without +91
      name: "Customer", // Optional but recommended
      notification_modes: ["SMS"], // Can add "WHATSAPP" as fallback
      user_consent: {
        timestamp: new Date().toISOString(),
        purpose: "User consent to fetch data.",
        obtained: true,
        type: "EXPLICIT",
      },
    };

    console.log(`📱 Sending OTP to: ${phone} (Verification ID: ${verificationId})`);
    console.log(`🔑 Using Verification API credentials: ${process.env.CASHFREE_VERIFICATION_APP_ID?.substring(0, 10)}...`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        "x-client-id": process.env.CASHFREE_VERIFICATION_APP_ID,
        "x-client-secret": process.env.CASHFREE_VERIFICATION_SECRET_KEY,
        "x-api-version": "2024-12-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Cashfree API Error:", data);
      
      // Provide helpful error messages
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { 
            error: "Invalid Verification API credentials. Please check your CASHFREE_VERIFICATION_APP_ID and CASHFREE_VERIFICATION_SECRET_KEY",
            hint: "Get credentials from: https://merchant.cashfree.com/verificationsuite/developers/api-keys"
          },
          { status: 500 }
        );
      }
      
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: "Verification API not enabled on your Cashfree account",
            hint: "Contact Cashfree support to enable Mobile 360 Verification API"
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { 
          error: data.message || data.error_msg || "Failed to send OTP",
          details: data
        },
        { status: 500 }
      );
    }

    console.log(`✅ OTP sent successfully. Status: ${data.status}`);

    return NextResponse.json({
      success: true,
      verification_id: data.verification_id,
      status: data.status,
      message: "OTP sent successfully to your mobile number",
    });
  } catch (error) {
    console.error("❌ Send OTP Error:", error);

    return NextResponse.json(
      {
        error: "Failed to send OTP. Please try again.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
