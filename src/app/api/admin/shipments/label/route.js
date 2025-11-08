import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order || !order.shiprocketShipmentId) {
      return NextResponse.json({
        error: 'Order not found or shipment not created'
      }, { status: 404 });
    }

    const response = await shiprocketService.generateLabel(order.shiprocketShipmentId);

    return NextResponse.json({
      success: true,
      labelUrl: response.label_url,
      message: 'Label generated successfully'
    });

  } catch (error) {
    console.error('Generate label error:', error);
    return NextResponse.json({
      error: 'Failed to generate label',
      details: error.message
    }, { status: 500 });
  }
}
