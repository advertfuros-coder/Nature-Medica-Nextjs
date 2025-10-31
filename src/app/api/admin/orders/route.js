import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/middleware/auth';

export async function GET(req) {
  try {
    // Verify admin authentication
    await requireAdmin(req);
    await connectDB();

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const paymentMode = searchParams.get('paymentMode');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');

    // Build query
    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    // Filter by payment mode
    if (paymentMode && paymentMode !== 'all') {
      query.paymentMode = paymentMode;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    // Search by order ID, customer name, email, or tracking ID
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { trackingId: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Fetching orders with query:', query);

    // Get orders with populated product details
    const orders = await Order.find(query)
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${orders.length} orders`);

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      _id: order._id.toString(),
      orderId: order.orderId,
      user: order.user?.toString(),
      userName: order.userName,
      userEmail: order.userEmail,
      items: order.items?.map(item => ({
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
      shippingAddress: order.shippingAddress,
      paymentMode: order.paymentMode,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingId: order.trackingId,
      courierName: order.courierName,
      shiprocketOrderId: order.shiprocketOrderId,
      shiprocketShipmentId: order.shiprocketShipmentId,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      couponCode: order.couponCode,
      statusHistory: order.statusHistory,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return NextResponse.json({ 
      success: true,
      orders: formattedOrders,
      total: formattedOrders.length
    });

  } catch (error) {
    console.error('Get orders error:', error);
    
    // Handle authentication errors
    if (error.message === 'Admin access required' || error.message === 'Authentication required') {
      return NextResponse.json({ 
        error: 'Unauthorized. Admin access required.' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      error: error.message || 'Failed to fetch orders' 
    }, { status: 500 });
  }
}
