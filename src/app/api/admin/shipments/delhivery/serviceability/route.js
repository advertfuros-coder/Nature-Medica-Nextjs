import { NextResponse } from 'next/server';
import delhiveryService from '@/lib/delhivery';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get('pincode');

    if (!pincode) {
      return NextResponse.json({ error: 'Pincode is required' }, { status: 400 });
    }

    const result = await delhiveryService.checkPincodeServiceability(pincode);

    const isServiceable = result.delivery_codes && result.delivery_codes.length > 0;
    const details = result.delivery_codes?.[0] || {};

    return NextResponse.json({
      success: true,
      pincode,
      serviceable: isServiceable,
      codAvailable: details.cod === 'Y',
      prepaidAvailable: details.pre_paid === 'Y',
      reverseAvailable: details.pickup === 'Y',
      cashAvailable: details.cash === 'Y',
      details
    });

  } catch (error) {
    console.error('Serviceability check error:', error);
    return NextResponse.json({
      error: 'Failed to check serviceability',
      details: error.message
    }, { status: 500 });
  }
}
