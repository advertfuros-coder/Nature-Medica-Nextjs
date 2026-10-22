import { NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { sendOTPEmail } from '@/lib/email';
import { applyRateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    // 🛡️ Security Rate Limiter: Max 3 password reset attempts per 15 minutes per IP
    const rateLimitResponse = applyRateLimit(req, 'forgot_password', 3, 15 * 60 * 1000);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    const user = await UserService.findUserByEmail(email);

    // Don't reveal if email exists for security
    if (!user) {
      return NextResponse.json({ 
        message: 'If an account exists with this email, you will receive a password reset OTP.'
      });
    }

    // Generate OTP
    const otp = UserService.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with reset OTP
    await UserService.updateUser(user._id, {
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: otpExpiry
    });

    // Send OTP email
    await sendOTPEmail(email, otp, 'reset');

    return NextResponse.json({ 
      message: 'Password reset OTP sent to your email',
      email: email
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      error: 'Failed to send reset OTP' 
    }, { status: 500 });
  }
}
