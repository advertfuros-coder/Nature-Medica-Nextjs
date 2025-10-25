import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

export async function POST(req) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const addressData = await req.json();

    const dbUser = await User.findById(user.userId);

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If this is default address, unset other default addresses
    if (addressData.isDefault) {
      dbUser.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    dbUser.addresses.push(addressData);
    await dbUser.save();

    return NextResponse.json({
      success: true,
      addresses: dbUser.addresses
    });

  } catch (error) {
    console.error('Add address error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add address' },
      { status: 500 }
    );
  }
}
