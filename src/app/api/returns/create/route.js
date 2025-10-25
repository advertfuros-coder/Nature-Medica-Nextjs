import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import Order from '@/models/Order';
import { requireAuth } from '@/middleware/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const { orderId, type, reason, detailedReason, refundMethod, bankDetails, upiDetails, images } = await req.json();

    // Find order
    const order = await Order.findOne({ orderId, user: user.userId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order is eligible for return (delivered within 7 days)
    if (order.orderStatus !== 'Delivered') {
      return NextResponse.json({ error: 'Only delivered orders can be returned' }, { status: 400 });
    }

    const daysSinceDelivery = (new Date() - new Date(order.updatedAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 7) {
      return NextResponse.json({ error: 'Return period has expired (7 days)' }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        if (image.startsWith('')) {
          const uploaded = await uploadImage(image, 'returns');
          uploadedImages.push(uploaded);
        }
      }
    }

    // Generate return ID
    const returnCount = await ReturnRequest.countDocuments();
    const returnId = `RET${String(returnCount + 1).padStart(6, '0')}`;

    // Create return request
    const returnRequest = await ReturnRequest.create({
      returnId,
      order: order._id,
      user: user.userId,
      items: order.items,
      type,
      reason,
      detailedReason,
      images: uploadedImages,
      refundMethod,
      bankDetails: refundMethod === 'bank' ? bankDetails : null,
      upiDetails: refundMethod === 'upi' ? upiDetails : null,
      refundAmount: order.finalPrice,
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        updatedAt: new Date(),
        note: `${type === 'return' ? 'Return' : 'Exchange'} request submitted`
      }]
    });

    return NextResponse.json({
      success: true,
      returnRequest: {
        returnId: returnRequest.returnId,
        status: returnRequest.status
      }
    });

  } catch (error) {
    console.error('Create return error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create return request' }, { status: 500 });
  }
}
