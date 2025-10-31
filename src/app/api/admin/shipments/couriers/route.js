import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import ShiprocketService from '@/lib/shiprocket';
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

    // Get courier serviceability
    const couriers = await ShiprocketService.getCourierServiceability(
      process.env.SHIPROCKET_PICKUP_PINCODE,
      order.shippingAddress.pincode,
      weight || 0.5,
      order.paymentMode === 'cod',
      order.finalPrice
    );

    // Filter and sort couriers by price
    const availableCouriers = couriers.available_courier_companies
      .filter(courier => courier.is_surface) // Filter surface shipping only
      .sort((a, b) => a.rate - b.rate) // Sort by price (cheapest first)
      .map(courier => ({
        courierId: courier.courier_company_id,
        courierName: courier.courier_name,
        rate: courier.rate,
        estimatedDeliveryDays: courier.etd,
        codCharges: courier.cod_charges,
        totalCharges: courier.rate + (order.paymentMode === 'cod' ? courier.cod_charges : 0),
        recommended: courier.recommendation_score || 0
      }));

    return NextResponse.json({
      success: true,
      couriers: availableCouriers,
      cheapest: availableCouriers[0],
      order: {
        orderId: order.orderId,
        pincode: order.shippingAddress.pincode,
        isCOD: order.paymentMode === 'cod',
        orderValue: order.finalPrice
      }
    });

  } catch (error) {
    console.error('Get couriers error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to get courier rates' 
    }, { status: 500 });
  }
}
