import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if already synced
    if (order.shiprocketOrderId) {
      return NextResponse.json({
        message: 'Order already synced to Shiprocket',
        shiprocketOrderId: order.shiprocketOrderId,
        dashboardUrl: `https://app.shiprocket.in/seller/orders/details/${order.shiprocketOrderId}`
      });
    }

    // Prepare Shiprocket order data
    const shiprocketData = {
      order_id: order.orderId,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: 'Primary',
      channel_id: '',
      comment: 'Order from Nature Medica',
      billing_customer_name: order.shippingAddress.name,
      billing_last_name: '',
      billing_address: order.shippingAddress.street,
      billing_address_2: order.shippingAddress.landmark || '',
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: 'India',
      billing_email: order.userEmail,
      billing_phone: order.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.title,
        sku: item.product.toString(),
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: ''
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
    const response = await shiprocketService.createOrder(shiprocketData);

    // Update order in database
    await Order.findByIdAndUpdate(order._id, {
      shiprocketOrderId: response.order_id,
      shiprocketShipmentId: response.shipment_id,
      $push: {
        statusHistory: {
          status: 'Synced to Shiprocket',
          updatedAt: new Date(),
          note: `Shiprocket Order ID: ${response.order_id}`
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: '✅ Order synced to Shiprocket successfully',
      shiprocketOrderId: response.order_id,
      shiprocketShipmentId: response.shipment_id,
      dashboardUrl: `https://app.shiprocket.in/seller/orders/details/${response.order_id}`
    });

  } catch (error) {
    console.error('Quick sync error:', error);
    return NextResponse.json({
      error: 'Failed to sync order to Shiprocket',
      details: error.message,
      suggestion: 'You can manually create the order in Shiprocket dashboard'
    }, { status: 500 });
  }
}
