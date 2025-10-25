import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateVerificationToken } from '@/lib/jwt';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req) {
  try {
    await connectDB();
    
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verified: false
    });

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken);

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
