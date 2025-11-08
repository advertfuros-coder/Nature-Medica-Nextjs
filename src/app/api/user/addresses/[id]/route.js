import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

// Update address
export async function PUT(req, { params }) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const { id } = params;
    const updateData = await req.json();

    const user = await User.findById(authData.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === id
    );

    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If marking as default, remove default from others
    if (updateData.isDefault) {
      user.addresses.forEach((addr, index) => {
        if (index !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    user.addresses[addressIndex] = { 
      ...user.addresses[addressIndex].toObject(), 
      ...updateData 
    };

    await user.save();

    return NextResponse.json({
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete address
export async function DELETE(req, { params }) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const { id } = params;

    const user = await User.findById(authData.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== id
    );

    await user.save();

    return NextResponse.json({
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
