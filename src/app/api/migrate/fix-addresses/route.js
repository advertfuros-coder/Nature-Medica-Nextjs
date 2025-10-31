import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({}).lean();
    let fixed = 0;
    let failed = 0;

    for (const order of orders) {
      // Check if shippingAddress is an ObjectId string
      if (typeof order.shippingAddress === 'string' || order.shippingAddress instanceof ObjectId) {
        try {
          // Get user's addresses
          const user = await User.findById(order.user).lean();
          
          if (user && user.addresses && user.addresses.length > 0) {
            // Find the address (use first one if can't match)
            const addressId = order.shippingAddress.toString();
            const address = user.addresses.find(a => a._id.toString() === addressId) || user.addresses[0];
            
            // Update order with actual address data
            await Order.updateOne(
              { _id: order._id },
              { 
                $set: { 
                  shippingAddress: {
                    name: address.name,
                    phone: address.phone,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    landmark: address.landmark || '',
                    type: address.type || 'home'
                  }
                } 
              }
            );
            fixed++;
          } else {
            failed++;
          }
        } catch (error) {
          console.error('Error fixing order:', order.orderId, error);
          failed++;
        }
      }
    }

    return NextResponse.json({
      message: 'Migration complete',
      totalOrders: orders.length,
      fixed,
      failed
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
