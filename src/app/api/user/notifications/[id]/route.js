import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth } from '@/middleware/auth';

export async function DELETE(req, { params }) {
  try {
    const authData = await requireAuth(req);
    await connectDB();

    const { id } = params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: authData.userId
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
