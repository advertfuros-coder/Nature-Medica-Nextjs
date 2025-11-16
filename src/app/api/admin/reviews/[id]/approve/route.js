import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

export async function PUT(req, context) {
  try {
    await connectDB();

    // ✅ Await params (Next.js 15)
    const params = await context.params;
    const { id } = params;

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    review.approved = true;
    await review.save();

    return NextResponse.json({
      success: true,
      message: 'Review approved successfully',
      review
    });

  } catch (error) {
    console.error('Approve review error:', error);
    return NextResponse.json({
      error: 'Failed to approve review',
      details: error.message
    }, { status: 500 });
  }
}
