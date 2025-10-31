import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId, trackingId, courierName, note } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order with manual shipment details
    order.isManualShipment = true;
    order.manualTrackingId = trackingId;
    order.manualCourierName = courierName;
    order.manualShipmentNote = note || 'Manual shipment entry';
    order.trackingId = trackingId;
    order.courierName = courierName;
    order.orderStatus = 'Shipped';

    order.statusHistory.push({
      status: 'Shipped',
      updatedAt: new Date(),
      note: `Manual shipment: ${courierName} - ${trackingId}${note ? ` (${note})` : ''}`
    });

    await order.save();

    console.log('✅ Manual shipment recorded:', orderId);

    return NextResponse.json({
      success: true,
      message: 'Manual shipment recorded successfully',
      order: {
        orderId: order.orderId,
        trackingId: order.trackingId,
        courierName: order.courierName
      }
    });

  } catch (error) {
    console.error('❌ Manual shipment error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to record manual shipment' 
    }, { status: 500 });
  }
}
