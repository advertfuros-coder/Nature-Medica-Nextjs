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

    const label = await ekartService.getLabel(order.ekartReferenceId);

    return NextResponse.json({
      success: true,
      labelUrl: label.label_url || label.pdf_url,
      message: 'Label generated successfully'
    });

  } catch (error) {
    console.error('Ekart label error:', error);
    return NextResponse.json({
      error: 'Failed to get label',
      details: error.message
    }, { status: 500 });
  }
}
