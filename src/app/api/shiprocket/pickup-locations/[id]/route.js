import { NextResponse } from 'next/server';
import shiprocketService from '@/lib/shiprocket';

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const token = await shiprocketService.getToken();
    
    // First, try to delete directly
    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/settings/company/pickup/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      // If deletion fails due to RTO, return specific error
      if (data.message?.includes('RTO') || data.message?.includes('return')) {
        return NextResponse.json({
          error: 'Cannot delete: Address is set as RTO address',
          details: data.message,
          suggestion: 'Change RTO address first using the update-rto endpoint'
        }, { status: 400 });
      }
      
      throw new Error(data.message || 'Failed to delete pickup location');
    }

    return NextResponse.json({
      success: true,
      message: 'Pickup location deleted successfully'
    });

  } catch (error) {
    console.error('Delete pickup location error:', error);
    return NextResponse.json({
      error: 'Failed to delete pickup location',
      details: error.message
    }, { status: 500 });
  }
}
