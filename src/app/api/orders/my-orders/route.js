import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth } from '@/middleware/auth';

export async function GET(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const orders = await Order.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
