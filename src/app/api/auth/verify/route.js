import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token required' },
        { status: 400 }
      );
    }

    // Find user with token
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
