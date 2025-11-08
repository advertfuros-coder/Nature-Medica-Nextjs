import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId, weight, dimensions, courierId } = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If not synced, create order first
    if (!order.shiprocketOrderId) {
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
        length: dimensions?.length || 10,
        breadth: dimensions?.breadth || 10,
        height: dimensions?.height || 10,
        weight: weight || 0.5
      };

      const response = await shiprocketService.createOrder(shiprocketData);

      await Order.findByIdAndUpdate(order._id, {
        shiprocketOrderId: response.order_id,
        shiprocketShipmentId: response.shipment_id
      });

      order.shiprocketOrderId = response.order_id;
      order.shiprocketShipmentId = response.shipment_id;
    }

    // Assign AWB
    const awbResponse = await shiprocketService.assignAWB(
      order.shiprocketShipmentId,
      courierId
    );

    // Update order with tracking info
    await Order.findByIdAndUpdate(order._id, {
      trackingId: awbResponse.response.data.awb_code,
      courierName: awbResponse.response.data.courier_name,
      orderStatus: 'Shipped',
      $push: {
        statusHistory: {
          status: 'Shipped',
          updatedAt: new Date(),
          note: `AWB: ${awbResponse.response.data.awb_code}, Courier: ${awbResponse.response.data.courier_name}`
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      trackingId: awbResponse.response.data.awb_code,
      courierName: awbResponse.response.data.courier_name
    });

  } catch (error) {
    console.error('Create shipment error:', error);
    return NextResponse.json({
      error: 'Failed to create shipment',
      details: error.message
    }, { status: 500 });
  }
}
