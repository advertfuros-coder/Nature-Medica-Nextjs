import { NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password required' 
      }, { status: 400 });
    }

    // Find user
    const user = await UserService.findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // DEBUG: Check what we got from database
    console.log('User from DB:', {
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      isEmailVerified: user.isEmailVerified
    });

    // Check if password exists
    if (!user.password) {
      console.error('Password field missing in user document');
      return NextResponse.json({ 
        error: 'Account data corrupted. Please contact support.' 
      }, { status: 500 });
    }

    // Check if verified
    if (!user.isEmailVerified) {
      return NextResponse.json({ 
        error: 'Please verify your email first',
        requiresVerification: true,
        email: user.email
      }, { status: 403 });
    }

    // Verify password
    const isValid = await UserService.verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Check if active
    if (!user.isActive) {
      return NextResponse.json({ 
        error: 'Account deactivated' 
      }, { status: 403 });
    }

    // Update last login
    await UserService.updateUser(user._id, {
      lastLogin: new Date()
    });

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

    const response = NextResponse.json({ 
      message: 'Login successful',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Login failed. Please try again.' 
    }, { status: 500 });
  }
}
