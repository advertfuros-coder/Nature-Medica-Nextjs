import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import delhiveryService from '@/lib/delhivery';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order || !order.delhiveryWaybill) {
      return NextResponse.json({
        error: 'Order not found or no Delhivery shipment exists'
      }, { status: 404 });
    }

    await delhiveryService.cancelShipment(order.delhiveryWaybill);

    await Order.findByIdAndUpdate(order._id, {
      orderStatus: 'Cancelled',
      trackingId: null,
      delhiveryWaybill: null,
      courierName: null,
      $push: {
        statusHistory: {
          status: 'Cancelled',
          updatedAt: new Date(),
          note: `Delhivery shipment cancelled - Waybill: ${order.delhiveryWaybill}`
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Delhivery shipment cancelled successfully'
    });

  } catch (error) {
    console.error('Delhivery cancellation error:', error);
    return NextResponse.json({
      error: 'Failed to cancel shipment',
      details: error.message
    }, { status: 500 });
  }
}
