import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ShiprocketService from '@/lib/shiprocket';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.shiprocketOrderId) {
      return NextResponse.json({ 
        error: 'Order already synced to Shiprocket',
        shiprocketOrderId: order.shiprocketOrderId,
        message: 'This order is already in Shiprocket dashboard'
      }, { status: 400 });
    }

    console.log('🚀 Quick syncing order to Shiprocket:', orderId);

    // Prepare Shiprocket order data
    const shiprocketOrderData = {
      order_id: order.orderId,
      order_date: order.createdAt.toISOString().split('T')[0],
      pickup_location: "Primary", // Must match your Shiprocket pickup location name
      channel_id: "",
      comment: "NatureMedica Order",
      
      // Billing = Customer address
      billing_customer_name: order.shippingAddress.name,
      billing_last_name: "",
      billing_address: order.shippingAddress.street,
      billing_address_2: order.shippingAddress.landmark || "",
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: "India",
      billing_email: order.userEmail,
      billing_phone: order.shippingAddress.phone,
      
      // Shipping same as billing
      shipping_is_billing: true,
      
      order_items: order.items.map(item => ({
        name: item.title,
        sku: item.product.toString(),
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: ""
      })),
      
      payment_method: order.paymentMode === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount || 0,
      sub_total: order.totalPrice,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    // Create order in Shiprocket
    const shiprocketResponse = await ShiprocketService.createOrder(shiprocketOrderData);

    // Update order with Shiprocket details
    order.shiprocketOrderId = shiprocketResponse.order_id;
    order.shiprocketShipmentId = shiprocketResponse.shipment_id;
    
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: order.orderStatus,
      updatedAt: new Date(),
      note: 'Order synced to Shiprocket dashboard'
    });

    await order.save();

    console.log('✅ Order synced to Shiprocket:', shiprocketResponse.order_id);

    return NextResponse.json({
      success: true,
      message: 'Order successfully synced to Shiprocket!',
      shiprocketOrderId: shiprocketResponse.order_id,
      shiprocketShipmentId: shiprocketResponse.shipment_id,
      dashboardUrl: `https://app.shiprocket.in/seller/orders/details/${shiprocketResponse.order_id}`
    });

  } catch (error) {
    console.error('❌ Quick sync error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to sync order to Shiprocket',
      suggestion: 'You can use manual entry or try again later'
    }, { status: 500 });
  }
}
