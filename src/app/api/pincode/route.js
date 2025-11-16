import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode');

  if (!pincode || pincode.length !== 6) {
    return NextResponse.json(
      { error: 'Invalid pincode' },
      { status: 400 }
    );
  }

  try {
    // Use HTTPS version of the API
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pincode details' },
      { status: 500 }
    );
  }
}
