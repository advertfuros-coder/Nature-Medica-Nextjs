import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function DELETE(req) {
  try {
    await connectDB();

    await Product.deleteMany({});
    await Category.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'All products and categories deleted'
    });

  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
