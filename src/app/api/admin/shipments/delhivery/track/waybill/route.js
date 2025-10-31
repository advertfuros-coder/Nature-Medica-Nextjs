import { NextResponse } from 'next/server';
import DelhiveryService from '@/lib/delhivery';

export async function GET(req, { params }) {
  try {
    const { waybill } = params;

    const trackingData = await DelhiveryService.trackShipment(waybill);

    return NextResponse.json({
      success: true,
      tracking: trackingData
    });

  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to track shipment' 
    }, { status: 500 });
  }
}
