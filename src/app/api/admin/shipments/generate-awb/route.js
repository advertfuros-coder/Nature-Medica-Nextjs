import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ShiprocketService from '@/lib/shiprocket';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId, courierId } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const phone = order.shippingAddress.phone;
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({
        error: 'Invalid mobile number. Must be 10 digits and start with 6, 7, 8, or 9.',
        phone
      }, { status: 400 });
    }

    if (!order.shiprocketShipmentId) {
      return NextResponse.json({ 
        error: 'Shipment not created yet. Create shipment first.' 
      }, { status: 400 });
    }

    if (order.trackingId) {
      return NextResponse.json({ 
        error: 'AWB already generated for this shipment',
        trackingId: order.trackingId
      }, { status: 400 });
    }

    // Generate AWB
    const awbResponse = await ShiprocketService.assignAWB(
      order.shiprocketShipmentId,
      courierId
    );

    if (awbResponse?.message?.includes('recharge your ShipRocket wallet')) {
      console.error('💰 Shiprocket wallet low balance:', JSON.stringify(awbResponse, null, 2));
      return NextResponse.json({
        error: 'Your Shiprocket wallet has insufficient balance. Please recharge it (minimum ₹100 required).',
        uiMessage: 'Please recharge your Shiprocket wallet with at least ₹100 to continue generating AWBs.',
        rawResponse: awbResponse
      }, { status: 402 }); // 402 = Payment Required
    }

    if (awbResponse?.response?.data?.awb_assign_error) {
      console.error('⚠️ Shiprocket AWB assignment failed:', JSON.stringify(awbResponse, null, 2));
      return NextResponse.json({
        error: awbResponse.response.data.awb_assign_error,
        rawResponse: awbResponse
      }, { status: 400 });
    }

    const awb = awbResponse.response.data.awb_code;
    const courier = awbResponse.response.data.courier_name;

    if (!awb || !courier) {
      return NextResponse.json({
        error: 'AWB missing from Shiprocket response.',
        rawResponse: awbResponse
      }, { status: 500 });
    }

    // Update order
    order.trackingId = awb;
    order.courierName = courier;
    order.orderStatus = 'Shipped';
    
    order.statusHistory.push({
      status: 'Shipped',
      updatedAt: new Date(),
      note: `AWB generated - ${order.trackingId}`
    });

    await order.save();

    // Schedule pickup
    await ShiprocketService.generatePickup(order.shiprocketShipmentId);


    return NextResponse.json({
      success: true,
      message: 'AWB generated and pickup scheduled',
      trackingId: order.trackingId,
      courierName: order.courierName
    });

  } catch (error) {
    console.error('Generate AWB error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate AWB' 
    }, { status: 500 });
  }
}
