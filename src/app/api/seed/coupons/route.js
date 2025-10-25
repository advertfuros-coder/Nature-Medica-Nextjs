import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(req) {
  try {
    await connectDB();

    const existingCoupons = await Coupon.countDocuments();
    if (existingCoupons > 0) {
      return NextResponse.json({
        error: 'Coupons already seeded. Delete existing coupons first.'
      }, { status: 400 });
    }

    // Set expiry dates (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const coupons = [
      {
        code: 'WELCOME10',
        type: 'percent',
        value: 10,
        minOrderValue: 299,
        usageLimit: 1000,
        usedCount: 0,
        expiryDate,
        active: true,
        description: 'Get 10% off on your first order above ₹299'
      },
      {
        code: 'SAVE20',
        type: 'percent',
        value: 20,
        minOrderValue: 999,
        usageLimit: 500,
        usedCount: 0,
        expiryDate,
        active: true,
        description: 'Save 20% on orders above ₹999'
      },
      {
        code: 'FLAT100',
        type: 'flat',
        value: 100,
        minOrderValue: 499,
        usageLimit: 750,
        usedCount: 0,
        expiryDate,
        active: true,
        description: 'Flat ₹100 off on orders above ₹499'
      },
      {
        code: 'WELLNESS50',
        type: 'flat',
        value: 50,
        minOrderValue: 399,
        usageLimit: null, // unlimited
        usedCount: 0,
        expiryDate,
        active: true,
        description: 'Get ₹50 off on wellness products'
      },
      {
        code: 'MEGA30',
        type: 'percent',
        value: 30,
        minOrderValue: 1499,
        usageLimit: 200,
        usedCount: 0,
        expiryDate,
        active: true,
        description: 'Mega Sale: 30% off on orders above ₹1499'
      }
    ];

    const insertedCoupons = await Coupon.insertMany(coupons);

    return NextResponse.json({
      success: true,
      message: 'Coupons seeded successfully',
      count: insertedCoupons.length,
      coupons: insertedCoupons.map(c => ({ 
        id: c._id, 
        code: c.code, 
        value: c.value,
        type: c.type 
      }))
    });

  } catch (error) {
    console.error('Seed coupons error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
