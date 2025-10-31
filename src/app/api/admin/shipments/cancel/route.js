import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ShiprocketService from '@/lib/shiprocket';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId, reason } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.trackingId) {
      return NextResponse.json({ 
        error: 'No tracking ID found. Shipment may not be created yet.' 
      }, { status: 400 });
    }

    // Cancel shipment
    await ShiprocketService.cancelShipment(order.trackingId);

    // Update order
    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      updatedAt: new Date(),
      note: reason || 'Shipment cancelled'
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Shipment cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel shipment error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to cancel shipment' 
    }, { status: 500 });
  }
}
