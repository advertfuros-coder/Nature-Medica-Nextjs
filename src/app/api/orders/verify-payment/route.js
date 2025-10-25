import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import crypto from 'crypto';
import { requireAuth } from '@/middleware/auth';

export async function POST(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderData
    } = await req.json();

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { error: 'Payment verification failed - Invalid signature' },
        { status: 400 }
      );
    }

    // Payment verified successfully - Now create the order
    const order = await Order.create({
      orderId: orderData.orderId,
      user: orderData.user,
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      discount: orderData.discount,
      finalPrice: orderData.finalPrice,
      shippingAddress: orderData.shippingAddress,
      paymentMode: 'online',
      couponCode: orderData.couponCode,
      paymentStatus: 'completed',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderStatus: 'Confirmed',
      statusHistory: [
        {
          status: 'Processing',
          updatedAt: new Date(),
          note: 'Order placed'
        },
        {
          status: 'Confirmed',
          updatedAt: new Date(),
          note: 'Payment completed successfully'
        }
      ]
    });

    // Update product stock
    for (const item of orderData.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Send order confirmation email (optional)
    // await sendOrderConfirmation(user.email, user.name, order.orderId, order);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order created successfully',
      orderId: order.orderId
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
