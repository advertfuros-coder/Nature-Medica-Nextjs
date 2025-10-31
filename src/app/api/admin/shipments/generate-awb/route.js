import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ShiprocketService from '@/lib/shiprocket';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId, courierId } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.shiprocketShipmentId) {
      return NextResponse.json({ 
        error: 'Shipment not created yet. Create shipment first.' 
      }, { status: 400 });
    }

    if (order.trackingId) {
      return NextResponse.json({ 
        error: 'AWB already generated for this shipment',
        trackingId: order.trackingId
      }, { status: 400 });
    }

    // Generate AWB
    const awbResponse = await ShiprocketService.generateAWB(
      order.shiprocketShipmentId,
      courierId
    );

    // Update order
    order.trackingId = awbResponse.response.data.awb_code;
    order.courierName = awbResponse.response.data.courier_name;
    order.orderStatus = 'Shipped';
    
    order.statusHistory.push({
      status: 'Shipped',
      updatedAt: new Date(),
      note: `AWB generated - ${order.trackingId}`
    });

    await order.save();

    // Schedule pickup
    await ShiprocketService.schedulePickup(order.shiprocketShipmentId);

    return NextResponse.json({
      success: true,
      message: 'AWB generated and pickup scheduled',
      trackingId: order.trackingId,
      courierName: order.courierName
    });

  } catch (error) {
    console.error('Generate AWB error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate AWB' 
    }, { status: 500 });
  }
}
