import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { requireAdmin } from '@/middleware/auth';
import { createShiprocketOrder, ensurePickupLocation } from '@/lib/shiprocket';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Fetch order with user details
    const order = await Order.findOne({ orderId }).populate('user', 'name email');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Validate shipping address
    if (!order.shippingAddress || !order.shippingAddress.street || !order.shippingAddress.phone) {
      return NextResponse.json({ 
        error: 'Order has incomplete shipping address' 
      }, { status: 400 });
    }

    // Ensure pickup location exists (auto-create if missing)
    try {
      await ensurePickupLocation();
    } catch (pickupError) {
      console.warn('Pickup location check failed:', pickupError.message);
      // Continue anyway - might already exist
    }

    // Create Shiprocket shipment
    const result = await createShiprocketOrder({
      orderId: order.orderId,
      customer: {
        name: order.user?.name || 'Customer',
        email: order.user?.email || 'customer@example.com',
      },
      shippingAddress: order.shippingAddress,
      items: order.items,
      paymentMode: order.paymentMode,
      totalPrice: order.totalPrice,
      discount: order.discount || 0
    });

    // Update order with Shiprocket info
    order.shiprocketOrderId = result.shiprocketOrderId;
    order.shipmentId = result.shipmentId;
    order.awbCode = result.awb;
    order.courierName = result.courierName;
    order.trackingId = result.awb;
    order.statusHistory.push({
      status: 'Shipped',
      updatedAt: new Date(),
      note: `Shiprocket shipment created. AWB: ${result.awb}`
    });
    order.orderStatus = 'Shipped';

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      shipment: {
        awbCode: order.awbCode,
        courierName: order.courierName,
        shipmentId: order.shipmentId
      }
    });

  } catch (error) {
    console.error('Shiprocket shipment error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create shipment' 
    }, { status: 500 });
  }
}
