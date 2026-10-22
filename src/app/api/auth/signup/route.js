import { NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { sendOTPEmail } from '@/lib/email';
import { applyRateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    // 🛡️ Security Rate Limiter: Max 5 signups per hour per IP to prevent spam accounts
    const rateLimitResponse = applyRateLimit(req, 'signup', 5, 60 * 60 * 1000);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await req.json();
    console.log('📥 Signup request:', { email: body.email, name: body.name });

    // Validate input
    const { name, email, password, phone } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!password?.trim()) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters' 
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await UserService.findUserByEmail(email);

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return NextResponse.json({ 
          error: 'Email already registered. Please login.' 
        }, { status: 400 });
      } else {
        // Resend OTP for unverified user
        const otp = UserService.generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await UserService.updateUser(existingUser._id, {
          emailVerificationOTP: otp,
          emailVerificationOTPExpires: otpExpiry
        });

        await sendOTPEmail(email, otp, 'verification');

        return NextResponse.json({ 
          message: 'Account exists but not verified. OTP resent.',
          email: email,
          requiresVerification: true
        });
      }
    }

    // Generate OTP
    const otp = UserService.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const result = await UserService.createUser({
      name: name.trim(),
      email: email.trim(),
      password: password,
      phone: phone?.trim() || '',
      otp: otp,
      otpExpiry: otpExpiry
    });

    console.log('✅ User created:', result.userId);

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'verification');

    if (!emailResult.success) {
      // Delete user if email fails (optional)
      console.error('Failed to send email');
    }

    return NextResponse.json({ 
      message: 'Signup successful! Check your email for verification code.',
      email: email,
      requiresVerification: true
    });

  } catch (error) {
    console.error('❌ Signup error:', error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json({ 
        error: 'Email already registered' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to create account. Please try again.' 
    }, { status: 500 });
  }
}
