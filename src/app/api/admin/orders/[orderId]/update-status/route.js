import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/middleware/auth';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { status, note, trackingId } = await req.json();

    const order = await Order.findOne({ orderId: params.orderId });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      updatedAt: new Date(),
      note: note || `Status updated to ${status}`
    });

    if (trackingId) {
      order.trackingId = trackingId;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
