import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import { requireAdmin } from '@/middleware/auth';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { status, adminNotes } = await req.json();

    const returnRequest = await ReturnRequest.findById(params.id);

    if (!returnRequest) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }

    returnRequest.status = status;
    returnRequest.adminNotes = adminNotes;
    returnRequest.statusHistory.push({
      status,
      updatedAt: new Date(),
      note: adminNotes || `Status updated to ${status}`
    });

    if (status === 'refunded') {
      returnRequest.refundProcessedDate = new Date();
    }

    await returnRequest.save();

    return NextResponse.json({
      success: true,
      returnRequest
    });

  } catch (error) {
    console.error('Update return status error:', error);
    return NextResponse.json({ error: 'Failed to update return status' }, { status: 500 });
  }
}
