import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Razorpay from 'razorpay';
import { formatPhoneForShiprocket, validateIndianMobile } from '@/lib/validators';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(req) {
  try {
    await connectDB();

    const {
      items,
      totalPrice,
      discount,
      deliveryCharge,
      finalPrice,
      shippingAddress,
      paymentMode,
      couponCode
    } = await req.json();

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone) {
      return NextResponse.json(
        { error: 'Shipping address is incomplete' },
        { status: 400 }
      );
    }

    // ✅ VALIDATE AND FORMAT PHONE NUMBER
    const cleanPhone = formatPhoneForShiprocket(shippingAddress.phone);
    
    if (!cleanPhone) {
      return NextResponse.json({
        error: 'Invalid phone number',
        details: 'Phone number must be 10 digits and start with 6, 7, 8, or 9'
      }, { status: 400 });
    }

    // Update shipping address with cleaned phone
    shippingAddress.phone = cleanPhone;

    // Get user from session/token
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate unique order ID
    const orderId = `NM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order object
    const orderData = {
      orderId,
      userId: user.id,
      userEmail: user.email,
      items,
      totalPrice,
      discount: discount || 0,
      deliveryCharge: deliveryCharge || 0,
      finalPrice: finalPrice || (totalPrice - (discount || 0) + (deliveryCharge || 0)),
      shippingAddress, // Now has cleaned phone number
      paymentMode,
      paymentStatus: paymentMode === 'online' ? 'pending' : 'pending',
      orderStatus: 'Pending',
      couponCode,
      statusHistory: [{
        status: 'Pending',
        updatedAt: new Date(),
        note: 'Order placed successfully'
      }]
    };

    // For online payment, create Razorpay order
    if (paymentMode === 'online') {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(orderData.finalPrice * 100), // Convert to paise
        currency: 'INR',
        receipt: orderId,
        notes: {
          orderId: orderId,
          customerEmail: user.email
        }
      });

      // Save order to database
      const order = await Order.create(orderData);

      return NextResponse.json({
        success: true,
        orderId: order.orderId,
        amount: orderData.finalPrice,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        orderData: {
          orderId: order.orderId,
          finalPrice: order.finalPrice
        }
      });
    }

    // For COD, save order directly
    const order = await Order.create(orderData);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orderId: order.orderId,
      order: {
        orderId: order.orderId,
        finalPrice: order.finalPrice,
        orderStatus: order.orderStatus
      }
    });

  } catch (error) {
    console.error('❌ Create order error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return NextResponse.json({
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Helper function to get user from request (implement based on your auth)
async function getUserFromRequest(req) {
  // TODO: Implement your authentication logic
  // This is a placeholder - replace with your actual auth implementation
  
  // Example using session cookie or JWT:
  const token = req.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  // Verify token and get user
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // const user = await User.findById(decoded.userId);
  
  // For now, return mock user (REPLACE THIS)
  return {
    id: 'user123',
    email: 'customer@example.com'
  };
}
