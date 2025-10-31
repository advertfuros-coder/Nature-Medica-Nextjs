import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import DelhiveryService from '@/lib/delhivery';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId, weight } = await req.json();
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.delhiveryWaybill) {
      return NextResponse.json({ 
        error: 'Shipment already created',
        waybill: order.delhiveryWaybill
      }, { status: 400 });
    }

    const timestamp = Date.now();
    const waybill = `${process.env.DELHIVERY_WAYBILL_PREFIX || 'NM'}${timestamp}`;

    try {
      // Try Delhivery API
      const shipmentResponse = await DelhiveryService.createShipment({
        waybill,
        orderId: order.orderId,
        name: order.shippingAddress.name,
        address: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode,
        phone: order.shippingAddress.phone,
        email: order.userEmail,
        isCOD: order.paymentMode === 'cod',
        amount: order.paymentMode === 'cod' ? order.finalPrice : 0,
        weight: weight || 0.5,
        itemCount: order.items.length,
        contents: order.items.map(i => i.title).join(', ')
      });

      // Update order
      order.delhiveryWaybill = waybill;
      order.trackingId = waybill;
      order.courierName = 'Delhivery';
      order.orderStatus = 'Shipped';
      order.shippingProvider = 'delhivery';

      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        status: 'Shipped',
        updatedAt: new Date(),
        note: `Delhivery waybill: ${waybill}`
      });

      await order.save();

      return NextResponse.json({
        success: true,
        message: '✅ Delhivery shipment created successfully!',
        waybill: waybill,
        courierName: 'Delhivery',
        trackingUrl: shipmentResponse.trackingUrl
      });

    } catch (error) {
      console.error('❌ Delhivery creation failed:', error.message);

      // If API unavailable, suggest manual entry
      if (error.message.includes('404') || error.message.includes('DELHIVERY_API_UNAVAILABLE')) {
        return NextResponse.json({
          success: false,
          error: '❌ Delhivery API is not accessible',
          code: 'DELHIVERY_API_ERROR',
          suggestion: 'Your account may not have API shipment creation enabled. Please:',
          steps: [
            '1. Verify pickup location is configured in Delhivery dashboard',
            '2. Contact Delhivery support: care@delhivery.com',
            '3. Use "Manual Entry" button as a workaround'
          ],
          waybill: waybill,
          workaround: 'Book shipment on Delhivery.com directly, then use Manual Entry in admin panel'
        }, { status: 400 });
      }

      return NextResponse.json({
        success: false,
        error: error.message,
        suggestion: 'Use Manual Entry button'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Route error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create shipment'
    }, { status: 500 });
  }
}
