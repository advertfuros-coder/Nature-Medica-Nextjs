import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const review = await Review.findById(params.id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating
    const reviews = await Review.find({ 
      product: productId, 
      approved: true 
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await Product.findByIdAndUpdate(productId, {
      ratingAvg: avgRating,
      reviewCount: reviews.length
    });

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
