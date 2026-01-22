import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FranchiseInquiry from "@/models/FranchiseInquiry";
import Settings from "@/models/Settings";
import { sendFranchiseNotificationEmail } from "@/lib/email";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();
    const {
      name,
      email,
      phone,
      state,
      city,
      pincode,
      address,
      investmentCapacity,
      propertyStatus,
      shopArea,
      profession,
      experience,
      message,
    } = data;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !state ||
      !city ||
      !pincode ||
      !address ||
      !investmentCapacity ||
      !propertyStatus ||
      !shopArea
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 },
      );
    }

    // 1. Save to MongoDB
    const inquiry = await FranchiseInquiry.create({
      name,
      email,
      phone,
      state,
      city,
      pincode,
      address,
      investmentCapacity,
      propertyStatus,
      shopArea,
      profession,
      experience,
      message,
      status: "new",
    });

    console.log("✅ Franchise inquiry saved to DB:", inquiry._id);

    // 2. Send Admin Notification Email
    try {
      const settings = await Settings.findOne({ type: "general" });
      const recipients = settings?.orderNotificationEmails || [
        process.env.ADMIN_EMAIL || "naturemedica09@gmail.com",
      ];

      if (recipients.length > 0) {
        await sendFranchiseNotificationEmail(inquiry, recipients);
      }
    } catch (emailError) {
      console.error(
        "⚠️ Failed to send franchise notification email:",
        emailError,
      );
    }

    // 3. Push to Google Sheet (If URL is provided in ENV or hardcoded as per user's existing pattern)
    // The user mentioned they will create a new sheet.
    // We'll use a placeholder or check for a specific ENV.
    const FRANCHISE_SHEET_URL =
      process.env.FRANCHISE_SHEET_URL ||
      "https://script.google.com/macros/s/AKfycby60VCV91RQXMGah008M4tarYW779Dof7Uqs6OcLWKfR_qUmEheLZOBQyIeWgLD6tqX/exec";

    try {
      if (FRANCHISE_SHEET_URL) {
        await fetch(FRANCHISE_SHEET_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "franchise_inquiry",
            ...data,
            createdAt: new Date().toISOString(),
          }),
        });
        console.log("✅ Franchise inquiry pushed to Google Sheets");
      }
    } catch (sheetError) {
      console.error("⚠️ Failed to push to Google Sheets:", sheetError);
    }

    return NextResponse.json({
      success: true,
      message: "Franchise inquiry submitted successfully",
      inquiryId: inquiry._id,
    });
  } catch (error) {
    console.error("❌ Franchise API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit inquiry" },
      { status: 500 },
    );
  }
}
