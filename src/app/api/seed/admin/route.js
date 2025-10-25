import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: 'Name, Email, and Password required' }, { status: 400 });

    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: true,
      role: 'admin'
    });

    return NextResponse.json({
      success: true,
      message: 'Admin seeded successfully',
      admin: { id: admin._id, email: admin.email, role: admin.role }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
