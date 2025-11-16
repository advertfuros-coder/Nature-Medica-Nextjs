import { NextResponse } from 'next/server';
import shiprocketService from '@/lib/shiprocket';

export async function GET() {
  try {
    const token = await shiprocketService.getToken();
    
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pickup locations');
    }

    return NextResponse.json({
      success: true,
      pickupLocations: data.data.shipping_address
    });

  } catch (error) {
    console.error('Get pickup locations error:', error);
    return NextResponse.json({
      error: 'Failed to fetch pickup locations',
      details: error.message
    }, { status: 500 });
  }
}
