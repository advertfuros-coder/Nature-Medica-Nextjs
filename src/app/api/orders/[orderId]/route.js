import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth } from '@/middleware/auth';

export async function GET(req, { params }) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const { orderId } = params;

    console.log('Fetching order:', orderId, 'for user:', user.userId);

    // Get order by orderId and verify it belongs to the user
    const order = await Order.findOne({ 
      orderId: orderId,
      user: user.userId 
    })
    .populate('items.product', 'title images')
    .lean();

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    // Format order for frontend
    const formattedOrder = {
      _id: order._id.toString(),
      orderId: order.orderId,
      items: order.items.map(item => ({
        product: item.product?._id?.toString() || item.product,
        title: item.title,
        image: item.image || item.product?.images?.[0]?.url,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant
      })),
      totalPrice: order.totalPrice,
      discount: order.discount,
      finalPrice: order.finalPrice,
      status: order.orderStatus?.toLowerCase() || 'pending',
      paymentMode: order.paymentMode,
      paymentStatus: order.paymentStatus,
      paymentId: order.razorpayPaymentId,
      shippingAddress: order.shippingAddress,
      trackingId: order.trackingId,
      couponCode: order.couponCode,
      statusHistory: order.statusHistory,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    return NextResponse.json({ order: formattedOrder });

  } catch (error) {
    console.error('Get order details error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch order details',
      details: error.message 
    }, { status: 500 });
  }
}
