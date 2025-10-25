import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const review = await Review.findByIdAndUpdate(
      params.id,
      { approved: true },
      { new: true }
    );

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update product rating
    const reviews = await Review.find({ 
      product: review.product, 
      approved: true 
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(review.product, {
      ratingAvg: avgRating,
      reviewCount: reviews.length
    });

    return NextResponse.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Approve review error:', error);
    return NextResponse.json(
      { error: 'Failed to approve review' },
      { status: 500 }
    );
  }
}
