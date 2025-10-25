import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const formData = await req.json();

    const coupon = await Coupon.create({
      ...formData,
      code: formData.code.toUpperCase()
    });

    return NextResponse.json({
      success: true,
      coupon
    });

  } catch (error) {
    console.error('Create coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
