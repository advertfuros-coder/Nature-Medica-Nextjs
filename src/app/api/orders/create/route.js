import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    // Get complete user info from database
    const user = await User.findById(authData.userId).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('📦 Creating order for user:', {
      userId: user._id.toString(),
      name: user.name,
      email: user.email
    });

    const {
      items,
      totalPrice,
      discount,
      finalPrice,
      shippingAddress,
      paymentMode,
      couponCode
    } = await req.json();

    console.log('📦 Order data received:', {
      itemsCount: items?.length,
      totalPrice,
      finalPrice,
      paymentMode,
      hasShippingAddress: !!shippingAddress,
      shippingAddressFields: shippingAddress ? Object.keys(shippingAddress) : []
    });

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || 
        !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.pincode) {
      return NextResponse.json({ 
        error: 'Complete shipping address is required',
        received: shippingAddress 
      }, { status: 400 });
    }

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ 
          error: `Product not found: ${item.title}` 
        }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${item.title}. Available: ${product.stock}` 
        }, { status: 400 });
      }
    }

    // Generate order ID
    const orderCount = await Order.countDocuments();
    const orderId = `NM${String(orderCount + 1).padStart(6, '0')}`;

    console.log('✅ Generated orderId:', orderId);

    // Prepare base order data
    const orderBaseData = {
      orderId,
      user: user._id,
      userName: user.name,
      userEmail: user.email,
      items: items.map(item => ({
        product: item.product,
        title: item.title,
        image: item.image || '',
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || ''
      })),
      totalPrice,
      discount: discount || 0,
      finalPrice,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        landmark: shippingAddress.landmark || '',
        type: shippingAddress.type || 'home'
      },
      paymentMode,
      couponCode: couponCode || null
    };

    console.log('📦 Order base data prepared:', {
      orderId: orderBaseData.orderId,
      userName: orderBaseData.userName,
      userEmail: orderBaseData.userEmail,
      itemsCount: orderBaseData.items.length,
      shippingCity: orderBaseData.shippingAddress.city
    });

    // For ONLINE payment
    if (paymentMode === 'online') {
      const razorpayOrder = await razorpay.orders.create({
        amount: finalPrice * 100,
        currency: 'INR',
        receipt: orderId,
        notes: {
          orderId: orderId,
          userId: user._id.toString(),
          userEmail: user.email
        }
      });

      console.log('💳 Razorpay order created:', razorpayOrder.id);

      return NextResponse.json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        orderId: orderId,
        amount: finalPrice,
        orderData: orderBaseData
      });
    } 
    
    // For COD
    else {
      const order = await Order.create({
        ...orderBaseData,
        paymentStatus: 'pending',
        orderStatus: 'Processing',
        statusHistory: [{
          status: 'Processing',
          updatedAt: new Date(),
          note: 'Order placed - Cash on Delivery'
        }]
      });

      console.log('✅ COD Order created successfully:', {
        orderId: order.orderId,
        _id: order._id.toString()
      });

      // Update product stock
      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }
        );
      }

      console.log('✅ Stock updated');

      return NextResponse.json({
        success: true,
        order: {
          orderId: order.orderId,
          finalPrice: order.finalPrice,
          _id: order._id.toString()
        }
      });
    }

  } catch (error) {
    console.error('❌ Create order error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create order',
        details: error.errors ? Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        })) : null
      },
      { status: 500 }
    );
  }
}
