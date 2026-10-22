import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    // 🛡️ Anti-bot rate limiter: Max 5 newsletter subscriptions per 15 minutes per IP
    const rateLimitResponse = applyRateLimit(req, "subscribe_form", 5, 15 * 60 * 1000);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { name, phone } = await req.json();

    // Replace with your Google Apps Script web app URL
    const scriptUrl = "https://script.google.com/macros/s/AKfycby60VCV91RQXMGah008M4tarYW779Dof7Uqs6OcLWKfR_qUmEheLZOBQyIeWgLD6tqX/exec";

    const response = await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify({ name, phone }),
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
