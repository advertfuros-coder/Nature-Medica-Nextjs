import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import { requireAuth } from '@/middleware/auth';

export async function GET(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const returns = await ReturnRequest.find({ user: user.userId })
      .populate('order')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      returns
    });

  } catch (error) {
    console.error('Get returns error:', error);
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}
