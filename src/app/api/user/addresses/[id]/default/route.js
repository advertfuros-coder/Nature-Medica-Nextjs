import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

export async function PUT(req, { params }) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const { id } = params;

    const user = await User.findById(authData.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove default from all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === id;
    });

    await user.save();

    return NextResponse.json({
      message: 'Default address updated',
      addresses: user.addresses
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
