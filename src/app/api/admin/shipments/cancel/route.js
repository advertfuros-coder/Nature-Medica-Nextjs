import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId, reason } = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order || !order.shiprocketOrderId) {
      return NextResponse.json({
        error: 'Order not found or not synced to Shiprocket'
      }, { status: 404 });
    }

    await shiprocketService.cancelOrder(order.shiprocketOrderId);

    await Order.findByIdAndUpdate(order._id, {
      orderStatus: 'Cancelled',
      trackingId: null,
      courierName: null,
      $push: {
        statusHistory: {
          status: 'Cancelled',
          updatedAt: new Date(),
          note: reason || 'Shipment cancelled by admin'
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Shipment cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel shipment error:', error);
    return NextResponse.json({
      error: 'Failed to cancel shipment',
      details: error.message
    }, { status: 500 });
  }
}
