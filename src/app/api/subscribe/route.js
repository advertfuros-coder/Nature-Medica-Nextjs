import { NextResponse } from "next/server";

export async function POST(req) {
  try {
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
