import { NextResponse } from 'next/headers';
import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import Order from '@/models/Order';
import User from '@/models/User';
import { requireAdmin } from '@/middleware/auth';
import { scheduleShiprocketPickup } from '@/lib/shiprocket';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { returnId } = await req.json();

    if (!returnId) {
      return NextResponse.json({ error: 'Return ID is required' }, { status: 400 });
    }

    // Fetch return request with populated order and user
    const returnRequest = await ReturnRequest.findOne({ returnId })
      .populate({
        path: 'order',
        select: 'orderId shippingAddress'
      })
      .populate({
        path: 'user',
        select: 'name email phone'
      });

    if (!returnRequest) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }

    // Get shipping address from original order
    const shippingAddress = returnRequest.order.shippingAddress;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.phone) {
      return NextResponse.json({ 
        error: 'Original order has incomplete shipping address' 
      }, { status: 400 });
    }

    // Schedule pickup via Shiprocket with customer's original delivery address
    const pickupResult = await scheduleShiprocketPickup({
      orderId: returnRequest.order.orderId,
      returnId: returnRequest.returnId,
      customer: {
        name: returnRequest.user.name,
        email: returnRequest.user.email,
        phone: returnRequest.user.phone || shippingAddress.phone
      },
      address: shippingAddress, // Use original shipping address for pickup
      items: returnRequest.items,
      totalAmount: returnRequest.refundAmount
    });

    // Update return request status
    returnRequest.status = 'pickup_scheduled';
    returnRequest.awbCode = pickupResult.awb;
    returnRequest.statusHistory.push({
      status: 'pickup_scheduled',
      updatedAt: new Date(),
      note: `Pickup scheduled. AWB: ${pickupResult.awb}`
    });
    returnRequest.pickupScheduled = new Date();

    await returnRequest.save();

    return NextResponse.json({
      success: true,
      message: 'Pickup scheduled successfully',
      pickup: {
        awb: pickupResult.awb,
        pickupId: pickupResult.pickupId,
        address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`
      }
    });

  } catch (error) {
    console.error('Shiprocket pickup error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to schedule pickup' 
    }, { status: 500 });
  }
}
