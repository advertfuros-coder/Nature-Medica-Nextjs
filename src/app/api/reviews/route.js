import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { requireAuth } from '@/middleware/auth';

export async function POST(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const { productId, rating, text } = await req.json();

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: user.userId
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    const review = await Review.create({
      product: productId,
      user: user.userId,
      rating,
      text,
      approved: false
    });

    return NextResponse.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
