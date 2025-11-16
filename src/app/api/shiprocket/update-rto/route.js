import { NextResponse } from 'next/server';
import shiprocketService from '@/lib/shiprocket';

export async function POST(req) {
  try {
    const { pickupLocationId } = await req.json();
    const token = await shiprocketService.getToken();
    
    // Update company settings to change RTO address
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/addpickup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        pickup_location: pickupLocationId,
        rto_address_id: pickupLocationId // Set this as RTO address
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update RTO address');
    }

    return NextResponse.json({
      success: true,
      message: 'RTO address updated successfully'
    });

  } catch (error) {
    console.error('Update RTO address error:', error);
    return NextResponse.json({
      error: 'Failed to update RTO address',
      details: error.message
    }, { status: 500 });
  }
}
