import { NextResponse } from 'next/server';
import delhiveryService from '@/lib/delhivery';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get('waybill');

    if (!waybill) {
      return NextResponse.json({ error: 'Waybill is required' }, { status: 400 });
    }

    const tracking = await delhiveryService.trackShipment(waybill);

    return NextResponse.json({
      success: true,
      waybill,
      tracking: tracking.ShipmentData || tracking
    });

  } catch (error) {
    console.error('Delhivery tracking error:', error);
    return NextResponse.json({
      error: 'Failed to track shipment',
      details: error.message
    }, { status: 500 });
  }
}
