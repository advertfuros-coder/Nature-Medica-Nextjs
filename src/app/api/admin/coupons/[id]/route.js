import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { requireAdmin } from '@/middleware/auth';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const formData = await req.json();

    const coupon = await Coupon.findByIdAndUpdate(
      params.id,
      { ...formData, code: formData.code.toUpperCase() },
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon
    });

  } catch (error) {
    console.error('Update coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const coupon = await Coupon.findByIdAndDelete(params.id);

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully'
    });

  } catch (error) {
    console.error('Delete coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
