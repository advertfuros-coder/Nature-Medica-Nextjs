import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

// Get all addresses
export async function GET(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const user = await User.findById(authData.userId).select('addresses');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add new address
export async function POST(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const addressData = await req.json();

    const user = await User.findById(authData.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || addressData.isDefault) {
      // Remove default from other addresses
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(addressData);
    await user.save();

    return NextResponse.json({
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
