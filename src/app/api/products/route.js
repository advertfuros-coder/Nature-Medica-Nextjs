import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

// Public endpoint to get products
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const visibility = searchParams.get('visibility');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Build query
    let query = {};
    
    // Only show visible products by default
    if (visibility === 'true' || visibility === null) {
      query.visibility = true;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch products
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .limit(limit)
      .select('title slug category description brand')
      .lean();

    return NextResponse.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      success: false 
    }, { status: 500 });
  }
}
