import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(req) {
  try {
    await connectDB();

    const { code, orderValue } = await req.json();

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      active: true 
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check minimum order value
    if (orderValue < coupon.minOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value is ₹${coupon.minOrderValue}` },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'flat') {
      discount = coupon.value;
    } else if (coupon.type === 'percent') {
      discount = Math.round((orderValue * coupon.value) / 100);
    }

    return NextResponse.json({
      success: true,
      discount,
      coupon: {
        code: coupon.code,
        description: coupon.description
      }
    });

  } catch (error) {
    console.error('Validate coupon error:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
