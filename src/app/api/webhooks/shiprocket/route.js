import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req) {
  try {
    await connectDB();

    const webhookData = await req.json();
    
    console.log('📦 Shiprocket webhook received:', webhookData);

    const { awb, current_status, order_id } = webhookData;

    // Find order by tracking ID or order ID
    const order = await Order.findOne({
      $or: [
        { trackingId: awb },
        { orderId: order_id }
      ]
    });

    if (!order) {
      console.log('Order not found for webhook');
      return NextResponse.json({ message: 'Order not found' });
    }

    // Map Shiprocket status to our order status
    const statusMap = {
      'PICKUP SCHEDULED': 'Processing',
      'PICKED UP': 'Shipped',
      'IN TRANSIT': 'Shipped',
      'OUT FOR DELIVERY': 'Shipped',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled',
      'RTO INITIATED': 'Cancelled',
      'RTO DELIVERED': 'Cancelled'
    };

    const newStatus = statusMap[current_status] || order.orderStatus;

    if (newStatus !== order.orderStatus) {
      order.orderStatus = newStatus;
      order.statusHistory.push({
        status: newStatus,
        updatedAt: new Date(),
        note: `Shiprocket update: ${current_status}`
      });

      await order.save();
      console.log(`✅ Order ${order.orderId} status updated to ${newStatus}`);
    }

    return NextResponse.json({ 
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed' 
    }, { status: 500 });
  }
}
