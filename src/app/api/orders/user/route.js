import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth } from '@/middleware/auth';

export async function GET(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    console.log('Fetching orders for user:', user.userId);

    // Get all orders for this user, sorted by most recent
    const orders = await Order.find({ user: user.userId })
      .populate('items.product', 'title images') // Populate product details
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JS objects

    console.log('Found orders:', orders.length);

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
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
      shippingAddress: order.shippingAddress,
      trackingId: order.trackingId,
      couponCode: order.couponCode,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return NextResponse.json({ orders: formattedOrders });

  } catch (error) {
    console.error('Get user orders error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    }, { status: 500 });
  }
}
