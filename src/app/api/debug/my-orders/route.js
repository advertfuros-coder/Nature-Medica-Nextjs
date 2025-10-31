import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth } from '@/middleware/auth';

export async function GET(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const allOrders = await Order.find({}).lean();
    const myOrders = await Order.find({ user: user.userId }).lean();

    return NextResponse.json({
      currentUserId: user.userId,
      totalOrders: allOrders.length,
      myOrdersCount: myOrders.length,
      allOrders: allOrders.map(o => ({
        orderId: o.orderId,
        userId: o.user?.toString(),
        status: o.orderStatus
      })),
      myOrders: myOrders.map(o => ({
        orderId: o.orderId,
        status: o.orderStatus,
        createdAt: o.createdAt
      }))
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
