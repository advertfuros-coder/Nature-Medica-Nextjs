import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth } from '@/middleware/auth';

export async function GET(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const notifications = await Notification.find({ user: authData.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const { title, message, type } = await req.json();

    const notification = await Notification.create({
      user: authData.userId,
      title,
      message,
      type: type || 'general',
      read: false
    });

    return NextResponse.json({
      message: 'Notification created',
      notification
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
