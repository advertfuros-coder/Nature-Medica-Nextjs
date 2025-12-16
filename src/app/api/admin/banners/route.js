import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import { requireAdmin } from "@/middleware/auth";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const formData = await req.json();

    let uploadedImage = null;
    if (formData.image && formData.image.startsWith("")) {
      uploadedImage = await uploadImage(formData.image, "banners");
    }

    const banner = await Banner.create({
      ...formData,
      image: uploadedImage,
    });

    return NextResponse.json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
