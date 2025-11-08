import { NextResponse } from 'next/server';
import ekartService from '@/lib/ekart';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceId = searchParams.get('referenceId');

    if (!referenceId) {
      return NextResponse.json({ error: 'Reference ID is required' }, { status: 400 });
    }

    const tracking = await ekartService.trackShipment(referenceId);

    return NextResponse.json({
      success: true,
      referenceId,
      tracking
    });

  } catch (error) {
    console.error('Ekart tracking error:', error);
    return NextResponse.json({
      error: 'Failed to track shipment',
      details: error.message
    }, { status: 500 });
  }
}
