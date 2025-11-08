import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

export async function GET(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const user = await User.findById(authData.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const { name, email, phone } = await req.json();

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: authData.userId } 
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    const user = await User.findByIdAndUpdate(
      authData.userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
