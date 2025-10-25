import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { reason } = await req.json();

    const order = await Order.findOne({ orderId: params.orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.orderStatus === 'Cancelled') {
      return NextResponse.json({ error: 'Order already cancelled' }, { status: 400 });
    }

    if (order.orderStatus === 'Delivered') {
      return NextResponse.json({ error: 'Cannot cancel delivered order' }, { status: 400 });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      updatedAt: new Date(),
      note: `Order cancelled by admin. Reason: ${reason}`
    });

    await order.save();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
