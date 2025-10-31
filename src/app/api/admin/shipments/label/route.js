import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ShiprocketService from '@/lib/shiprocket';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.shiprocketShipmentId) {
      return NextResponse.json({ 
        error: 'Shipment not created yet' 
      }, { status: 400 });
    }

    // Get shipping label
    const labelResponse = await ShiprocketService.getShippingLabel(
      order.shiprocketShipmentId
    );

    return NextResponse.json({
      success: true,
      labelUrl: labelResponse.label_url,
      message: 'Shipping label generated'
    });

  } catch (error) {
    console.error('Get label error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to get shipping label' 
    }, { status: 500 });
  }
}
