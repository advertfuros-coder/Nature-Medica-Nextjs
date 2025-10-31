import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/middleware/auth';

export async function GET(req, { params }) {
  try {
    // Verify admin authentication
    await requireAdmin(req);
    await connectDB();

    const { orderId } = params;

    console.log('Fetching order:', orderId);

    // Find order by orderId (not _id)
    const order = await Order.findOne({ orderId })
      .populate('items.product', 'title images')
      .lean();

    if (!order) {
      console.log('Order not found:', orderId);
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    console.log('Order found:', order.orderId);

    // Format order for frontend
    const formattedOrder = {
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
      razorpaySignature: order.razorpaySignature,
      couponCode: order.couponCode,
      statusHistory: order.statusHistory,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };

    return NextResponse.json({ 
      success: true,
      order: formattedOrder 
    });

  } catch (error) {
    console.error('Get order details error:', error);
    
    // Handle authentication errors
    if (error.message === 'Admin access required' || error.message === 'Authentication required') {
      return NextResponse.json({ 
        error: 'Unauthorized. Admin access required.' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      error: error.message || 'Failed to fetch order details' 
    }, { status: 500 });
  }
}

// Update order (optional - for future use)
export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId } = params;
    const updates = await req.json();

    console.log('Updating order:', orderId, updates);

    const order = await Order.findOneAndUpdate(
      { orderId },
      { $set: updates },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order updated successfully',
      order 
    });

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update order' 
    }, { status: 500 });
  }
}

// Delete order (optional - for future use)
export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId } = params;

    console.log('Deleting order:', orderId);

    const order = await Order.findOneAndDelete({ orderId });

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order deleted successfully' 
    });

  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete order' 
    }, { status: 500 });
  }
}
