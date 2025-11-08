import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId, weight } = await req.json();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '226001';
    const deliveryPincode = order.shippingAddress.pincode;
    const isCOD = order.paymentMode === 'cod' ? 1 : 0;

    // Get available couriers
    const response = await shiprocketService.getCourierServiceability(
      pickupPincode,
      deliveryPincode,
      weight || 0.5,
      isCOD
    );

    if (!response.data || !response.data.available_courier_companies) {
      return NextResponse.json({
        error: 'No couriers available for this location'
      }, { status: 400 });
    }

    const couriers = response.data.available_courier_companies.map(courier => ({
      courierId: courier.courier_company_id,
      courierName: courier.courier_name,
      freight: courier.freight_charge,
      codCharges: courier.cod_charges || 0,
      totalCharge: courier.rate,
      estimatedDeliveryDays: courier.estimated_delivery_days,
      recommended: courier.recommendation_score || 0
    }));

    // Find cheapest courier
    const cheapest = couriers.reduce((min, courier) => 
      courier.totalCharge < min.totalCharge ? courier : min
    );

    return NextResponse.json({
      success: true,
      couriers,
      cheapest,
      pickupPincode,
      deliveryPincode
    });

  } catch (error) {
    console.error('Get couriers error:', error);
    return NextResponse.json({
      error: 'Failed to fetch couriers',
      details: error.message
    }, { status: 500 });
  }
}
