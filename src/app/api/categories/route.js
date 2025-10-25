import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({ active: true })
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
