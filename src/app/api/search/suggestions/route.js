import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Get matching products (limit to top 8 results for autocomplete)
    const products = await Product.find({
      visibility: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { ingredients: { $regex: query, $options: "i" } },
      ],
    })
      .select("title brand images price mrp slug")
      .limit(8)
      .lean();

    // Also get unique brand suggestions
    const brandMatches = await Product.distinct("brand", {
      visibility: true,
      brand: { $regex: query, $options: "i" },
    }).limit(3);

    const suggestions = {
      products: products.map((p) => ({
        id: p._id,
        title: p.title,
        brand: p.brand,
        image: p.images?.[0]?.url || null,
        price: p.price,
        mrp: p.mrp,
        slug: p.slug,
      })),
      brands: brandMatches,
    };

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
