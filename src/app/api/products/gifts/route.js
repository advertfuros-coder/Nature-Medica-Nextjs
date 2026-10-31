import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { GIFT_TIERS } from '@/lib/giftTiers';

export const dynamic = 'force-dynamic';

// Public endpoint: in-stock free-gift products for the cart milestones
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({
      slug: { $in: GIFT_TIERS.map((t) => t.slug) },
      visibility: true,
      stock: { $gt: 0 },
    }).lean();
    return NextResponse.json({ products: JSON.parse(JSON.stringify(products)) });
  } catch (error) {
    console.error('Error fetching gift products:', error);
    return NextResponse.json({ products: [] });
  }
}
