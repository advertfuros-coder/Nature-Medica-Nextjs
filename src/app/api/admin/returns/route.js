import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import { requireAdmin } from '@/middleware/auth';

export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const returns = await ReturnRequest.find(query)
      .populate('user', 'name email')
      .populate('order', 'orderId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalReturns = await ReturnRequest.countDocuments(query);
    const totalPages = Math.ceil(totalReturns / limit);

    return NextResponse.json({
      success: true,
      returns,
      currentPage: page,
      totalPages,
      totalReturns
    });

  } catch (error) {
    console.error('Get admin returns error:', error);
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}
