import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { verifyPhonePePayment } from '@/lib/phonepe';
import { requireAuth } from '@/middleware/auth';

export async function POST(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const user = await User.findById(authData.userId).lean();

    const { merchantTransactionId, orderData } = await req.json();

    console.log('💳 Verifying PhonePe payment:', merchantTransactionId);

    // Verify payment with PhonePe
    const verificationResult = await verifyPhonePePayment(merchantTransactionId);

    if (!verificationResult.success || verificationResult.code !== 'PAYMENT_SUCCESS') {
      console.error('❌ Payment not successful:', verificationResult.message);
      return NextResponse.json(
        { error: 'Payment verification failed', details: verificationResult.message },
        { status: 400 }
      );
    }

    console.log('✅ Payment verified successfully');

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

    // Create order
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
      phonePeTransactionId: merchantTransactionId,
      phonePePaymentId: verificationResult.data.transactionId,
      couponCode: orderData.couponCode,
      statusHistory: [{
        status: 'Processing',
        updatedAt: new Date(),
        note: 'Payment successful via PhonePe - Order placed'
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
      { error: 'Payment verification failed', details: error.message },
      { status: 500 }
    );
  }
}
