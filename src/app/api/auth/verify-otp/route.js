import { NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { sendWelcomeEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ 
        error: 'Email and OTP are required' 
      }, { status: 400 });
    }

    const user = await UserService.findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check OTP
    if (user.emailVerificationOTP !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Check expiry
    if (new Date() > new Date(user.emailVerificationOTPExpires)) {
      return NextResponse.json({ 
        error: 'OTP expired. Please request a new one.' 
      }, { status: 400 });
    }

    // Verify user
    await UserService.updateUser(user._id, {
      isEmailVerified: true,
      emailVerificationOTP: null,
      emailVerificationOTPExpires: null,
      lastLogin: new Date()
    });

    // Send welcome email
    await sendWelcomeEmail(user.name, user.email);

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'nature-medica-jwt-secret-key-production-32charsmin';
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email, 
        role: user.role 
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json({ 
      message: 'Email verified successfully!',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ 
      error: 'Verification failed' 
    }, { status: 500 });
  }
}
