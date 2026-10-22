import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import { requireAdmin } from "@/middleware/auth";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const query = {};
    if (type) {
      if (type.includes(",")) {
        query.type = { $in: type.split(",") };
      } else {
        query.type = type;
      }
    }

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      banners: JSON.parse(JSON.stringify(banners)),
    });
  } catch (error) {
    console.error("Fetch banners error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const formData = await req.json();

    let uploadedImage = formData.image;

    // If client sends a raw base64 data URI, upload to Cloudinary
    if (typeof formData.image === "string" && formData.image.startsWith("data:")) {
      uploadedImage = await uploadImage(formData.image, "banners");
    } else if (typeof formData.image === "object" && formData.image?.url?.startsWith("data:")) {
      uploadedImage = await uploadImage(formData.image.url, "banners");
    }

    if (!uploadedImage || !uploadedImage.url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const banner = await Banner.create({
      type: formData.type || "hero_left",
      title: formData.title || "",
      subtitle: formData.subtitle || "",
      badge: formData.badge || "",
      tagline: formData.tagline || "",
      categoryName: formData.categoryName || "",
      link: formData.link || "/products",
      order: Number(formData.order) || 0,
      active: formData.active !== false,
      image: uploadedImage,
    });

    return NextResponse.json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create banner" },
      { status: 500 }
    );
  }
}
