import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// Public endpoint: the low-price add-on offer shown in the cart and at checkout.
// Prefers products with a configured bumpPrice, otherwise the cheapest in-stock product.
// Items already in the cart can be skipped with ?exclude=id1,id2
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const exclude = (searchParams.get('exclude') || '')
      .split(',')
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const base = {
      visibility: true,
      stock: { $gt: 0 },
      price: { $gt: 0 },
      ...(exclude.length > 0 && { _id: { $nin: exclude } }),
    };

    let product = await Product.findOne({ ...base, bumpPrice: { $gt: 0 } })
      .sort({ updatedAt: -1 })
      .lean();

    if (product && product.bumpPrice >= product.price) product = null;

    if (!product) {
      product = await Product.findOne(base).sort({ price: 1 }).lean();
    }

    if (!product) {
      return NextResponse.json({ product: null });
    }

    const offerPrice =
      product.bumpPrice > 0 && product.bumpPrice < product.price ? product.bumpPrice : product.price;

    return NextResponse.json({
      product: { ...JSON.parse(JSON.stringify(product)), offerPrice },
    });
  } catch (error) {
    console.error('Error fetching add-on product:', error);
    return NextResponse.json({ product: null });
  }
}
