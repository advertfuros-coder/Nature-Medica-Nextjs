import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import crypto from 'crypto';
import { requireAuth } from '@/middleware/auth';

export async function POST(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    // Get user info
    const user = await User.findById(authData.userId).lean();

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderData
    } = await req.json();

    console.log('💳 Verifying payment:', {
      razorpayOrderId,
      razorpayPaymentId,
      orderId: orderData?.orderId
    });

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      console.error('❌ Signature mismatch');
      return NextResponse.json(
        { error: 'Payment verification failed - Invalid signature' },
        { status: 400 }
      );
    }

    console.log('✅ Payment signature verified');

    // Check if order already exists
    const existingOrder = await Order.findOne({ orderId: orderData.orderId });
    
    if (existingOrder) {
      console.log('⚠️ Order already exists:', orderData.orderId);
      return NextResponse.json({
        success: true,
        orderId: existingOrder.orderId,
        _id: existingOrder._id.toString()
      });
    }

    // Create order with user details
    const order = await Order.create({
      orderId: orderData.orderId,
      user: user._id,
      userName: user.name,
      userEmail: user.email,
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      discount: orderData.discount || 0,
      finalPrice: orderData.finalPrice,
      shippingAddress: orderData.shippingAddress,
      paymentMode: 'online',
      paymentStatus: 'paid',
      orderStatus: 'Processing',
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId,
      razorpaySignature: razorpaySignature,
      couponCode: orderData.couponCode,
      statusHistory: [{
        status: 'Processing',
        updatedAt: new Date(),
        note: 'Payment successful - Order placed'
      }]
    });

    console.log('✅ Order created:', order.orderId);

    // Update stock
    for (const item of orderData.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    console.log('✅ Stock updated');

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order created',
      orderId: order.orderId,
      _id: order._id.toString()
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
