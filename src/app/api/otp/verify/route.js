import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { verification_id, otp, phone } = await req.json();

    // Validate inputs
    if (!verification_id || !otp) {
      return NextResponse.json(
        { error: "Verification ID and OTP are required" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "OTP must be 6 digits" },
        { status: 400 }
      );
    }

    // Check if Cashfree Verification credentials are available
    if (
      !process.env.CASHFREE_VERIFICATION_APP_ID ||
      !process.env.CASHFREE_VERIFICATION_SECRET_KEY
    ) {
      console.error("❌ Cashfree Verification API credentials not found");
      return NextResponse.json(
        {
          error:
            "OTP service not configured. Please add Verification API credentials.",
        },
        { status: 500 }
      );
    }

    // Determine API URL based on environment
    const isProduction = process.env.CASHFREE_ENV === "PRODUCTION";
    const apiUrl = isProduction
      ? "https://api.cashfree.com/verification/mobile360/otp/verify"
      : "https://sandbox.cashfree.com/verification/mobile360/otp/verify";

    const payload = {
      verification_id: verification_id,
      otp: otp,
    };

    console.log(`🔐 Verifying OTP for verification ID: ${verification_id}`);

    const response = await fetch(apiUrl, {
      method: "POST",
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
      console.error("❌ Cashfree Verify Error:", data);

      if (response.status === 400) {
        return NextResponse.json(
          { error: "Invalid or expired OTP. Please request a new one." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: data.message || data.error_msg || "Failed to verify OTP" },
        { status: 500 }
      );
    }

    // Check if OTP is valid
    if (data.status === "SUCCESS") {
      console.log(`✅ OTP verified successfully for phone: ${phone}`);

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Phone number verified successfully",
        data: {
          verification_id: data.verification_id,
          reference_id: data.reference_id,
        },
      });
    } else {
      console.log(`❌ OTP verification failed. Status: ${data.status}`);

      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: "Invalid OTP. Please try again.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("❌ Verify OTP Error:", error);

    return NextResponse.json(
      {
        error: "Failed to verify OTP. Please try again.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
