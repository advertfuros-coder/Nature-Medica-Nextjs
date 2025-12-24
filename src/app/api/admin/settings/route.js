import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth";
// import { authOptions } from '../../auth/[...nextauth]/route'; // Make sure to import auth options if you have protection

export async function GET(req) {
  try {
    await dbConnect();

    // In a real app, ensure this is protected
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    let settings = await Settings.findOne({ type: "general" });

    if (!settings) {
      settings = await Settings.create({
        type: "general",
        orderNotificationEmails: [],
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    // Check auth here too

    const { emails } = await req.json();

    if (!Array.isArray(emails)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // specific validation for emails can be added here

    const settings = await Settings.findOneAndUpdate(
      { type: "general" },
      { $set: { orderNotificationEmails: emails } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
