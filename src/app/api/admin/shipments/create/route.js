import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ShiprocketService from '@/lib/shiprocket';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId, weight, dimensions, courierId } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.shiprocketOrderId) {
      return NextResponse.json({ 
        error: 'Shipment already created for this order',
        shiprocketOrderId: order.shiprocketOrderId
      }, { status: 400 });
    }

    // Prepare Shiprocket order data
    const shiprocketOrderData = {
      order_id: order.orderId,
      order_date: order.createdAt.toISOString().split('T')[0],
      pickup_location: "NatureMedica Warehouse", // Must match EXACT name in Shiprocket dashboard
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
      length: dimensions?.length || 10,
      breadth: dimensions?.breadth || 10,
      height: dimensions?.height || 10,
      weight: weight || 0.5
    };

    console.log('Creating Shiprocket order:', shiprocketOrderData);

    // Create order in Shiprocket
    const shiprocketResponse = await ShiprocketService.createOrder(shiprocketOrderData);

    // Update order with Shiprocket details
    order.shiprocketOrderId = shiprocketResponse.order_id;
    order.shiprocketShipmentId = shiprocketResponse.shipment_id;
    order.orderStatus = 'Processing';
    
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: 'Processing',
      updatedAt: new Date(),
      note: 'Shipment created in Shiprocket'
    });

    await order.save();

    // Auto-generate AWB if courier is selected
    if (courierId) {
      try {
        const awbResponse = await ShiprocketService.generateAWB(
          shiprocketResponse.shipment_id,
          courierId
        );

        order.trackingId = awbResponse.response.data.awb_code;
        order.courierName = awbResponse.response.data.courier_name;
        order.orderStatus = 'Shipped';
        
        order.statusHistory.push({
          status: 'Shipped',
          updatedAt: new Date(),
          note: `AWB generated: ${order.trackingId}`
        });
        
        await order.save();

        // Schedule pickup
        await ShiprocketService.schedulePickup(shiprocketResponse.shipment_id);
        
        console.log('✅ AWB generated and pickup scheduled');
      } catch (awbError) {
        console.error('❌ AWB generation failed:', awbError);
        // Continue without failing the shipment creation
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      shiprocketOrderId: shiprocketResponse.order_id,
      shiprocketShipmentId: shiprocketResponse.shipment_id,
      trackingId: order.trackingId
    });

  } catch (error) {
    console.error('❌ Create shipment error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create shipment' 
    }, { status: 500 });
  }
}
