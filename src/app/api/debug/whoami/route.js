import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    // Get token
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from middleware
    const authUser = await requireAuth(req);
    
    // Get user from database
    await connectDB();
    const dbUser = await User.findById(authUser.userId).lean();

    return NextResponse.json({
      tokenData: decoded,
      authUserData: authUser,
      databaseUser: {
        _id: dbUser?._id?.toString(),
        name: dbUser?.name,
        email: dbUser?.email,
        role: dbUser?.role
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
