import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId, trackingId, courierName, note } = await req.json();

    if (!trackingId || !courierName) {
      return NextResponse.json({
        error: 'Tracking ID and courier name are required'
      }, { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await Order.findByIdAndUpdate(order._id, {
      trackingId,
      courierName,
      isManualShipment: true,
      manualShipmentNote: note || '',
      orderStatus: 'Shipped',
      $push: {
        statusHistory: {
          status: 'Shipped',
          updatedAt: new Date(),
          note: `Manual Entry - ${courierName}: ${trackingId}${note ? ` (${note})` : ''}`
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Manual shipment recorded successfully'
    });

  } catch (error) {
    console.error('Manual shipment error:', error);
    return NextResponse.json({
      error: 'Failed to record manual shipment',
      details: error.message
    }, { status: 500 });
  }
}
