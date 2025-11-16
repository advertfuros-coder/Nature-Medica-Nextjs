import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';

export async function POST(req) {
  try {
    const { shiprocketOrderId } = await req.json();
    
    if (!shiprocketOrderId) {
      return NextResponse.json({ error: 'Shiprocket Order ID required' }, { status: 400 });
    }

    const token = await shiprocketService.getToken();
    
    // Get order details from Shiprocket
    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/orders/show/${shiprocketOrderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch order from Shiprocket',
        details: data 
      }, { status: 400 });
    }

    const orderData = data.data;
    
    // Check if order already exists
    await connectDB();
    const existingOrder = await Order.findOne({ orderId: orderData.channel_order_id });
    
    if (existingOrder) {
      // Update tracking info
      await Order.findByIdAndUpdate(existingOrder._id, {
        trackingId: orderData.awb_code,
        courierName: orderData.courier_name,
        shiprocketOrderId: orderData.id,
        shiprocketShipmentId: orderData.shipments?.[0]?.id
      });
      
      return NextResponse.json({
        success: true,
        message: 'Order updated with tracking info',
        orderId: existingOrder.orderId
      });
    }

    return NextResponse.json({
      error: 'Order not found in database',
      message: 'This order exists in Shiprocket but not in your database. It may have been created manually.'
    }, { status: 404 });

  } catch (error) {
    console.error('Sync order error:', error);
    return NextResponse.json({
      error: 'Failed to sync order',
      details: error.message
    }, { status: 500 });
  }
}
