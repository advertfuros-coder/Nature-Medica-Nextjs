import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticate } from '@/middleware/auth';

export async function GET(req) {
  try {
    const auth = await authenticate(req);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findById(auth.user.userId).select('-password -verificationToken -resetPasswordToken');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
