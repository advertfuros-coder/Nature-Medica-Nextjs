import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ekartService from '@/lib/ekart';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order || !order.ekartReferenceId) {
      return NextResponse.json({
        error: 'Order not found or no Ekart shipment'
      }, { status: 404 });
    }

    await ekartService.cancelShipment(order.ekartReferenceId);

    await Order.findByIdAndUpdate(order._id, {
      orderStatus: 'Cancelled',
      trackingId: null,
      ekartReferenceId: null,
      ekartTrackingId: null,
      $push: {
        statusHistory: {
          status: 'Cancelled',
          updatedAt: new Date(),
          note: `Ekart shipment cancelled - Ref: ${order.ekartReferenceId}`
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Ekart shipment cancelled successfully'
    });

  } catch (error) {
    console.error('Ekart cancel error:', error);
    return NextResponse.json({
      error: 'Failed to cancel shipment',
      details: error.message
    }, { status: 500 });
  }
}
