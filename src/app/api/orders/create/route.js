import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAuth } from '@/middleware/auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const {
      items,
      totalPrice,
      discount,
      finalPrice,
      shippingAddress,
      paymentMode,
      couponCode
    } = await req.json();

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.title}` },
          { status: 400 }
        );
      }
    }

    // Generate order ID
    const orderCount = await Order.countDocuments();
    const orderId = `ORD${String(orderCount + 1).padStart(6, '0')}`;

    // For ONLINE payment: Create Razorpay order first, save order after payment
    if (paymentMode === 'online') {
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: finalPrice * 100, // Amount in paise
        currency: 'INR',
        receipt: orderId,
        notes: {
          orderId: orderId,
          userId: user.userId
        }
      });

      // Store order data temporarily (will be created after payment verification)
      // We'll pass this data to frontend and create order after payment success
      return NextResponse.json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        orderId: orderId,
        amount: finalPrice,
        orderData: {
          orderId,
          user: user.userId,
          items,
          totalPrice,
          discount,
          finalPrice,
          shippingAddress,
          paymentMode,
          couponCode,
          razorpayOrderId: razorpayOrder.id
        }
      });
    } 
    
    // For COD: Create order immediately
    else {
      const order = await Order.create({
        orderId,
        user: user.userId,
        items,
        totalPrice,
        discount,
        finalPrice,
        shippingAddress,
        paymentMode: 'cod',
        couponCode,
        paymentStatus: 'pending',
        orderStatus: 'Processing',
        statusHistory: [{
          status: 'Processing',
          updatedAt: new Date(),
          note: 'Order placed - Cash on Delivery'
        }]
      });

      // Update product stock
      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }
        );
      }

      // Send order confirmation email (optional)
      // await sendOrderConfirmation(user.email, user.name, orderId, order);

      return NextResponse.json({
        success: true,
        order: {
          orderId: order.orderId,
          finalPrice: order.finalPrice
        }
      });
    }

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
