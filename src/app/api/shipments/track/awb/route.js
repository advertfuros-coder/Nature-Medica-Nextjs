import { NextResponse } from 'next/server';
import ShiprocketService from '@/lib/shiprocket';

export async function GET(req, { params }) {
  try {
    const { awb } = params;

    if (!awb) {
      return NextResponse.json({ error: 'AWB required' }, { status: 400 });
    }

    // Track shipment
    const trackingData = await ShiprocketService.trackShipment(awb);

    return NextResponse.json({
      success: true,
      tracking: trackingData
    });

  } catch (error) {
    console.error('Track shipment error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to track shipment' 
    }, { status: 500 });
  }
}
