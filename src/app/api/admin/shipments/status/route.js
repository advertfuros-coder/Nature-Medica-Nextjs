import { NextResponse } from 'next/server';
import ShiprocketService from '@/lib/shiprocket';
import { requireAdmin } from '@/middleware/auth';

export async function GET(req) {
  try {
    await requireAdmin(req);

    try {
      await ShiprocketService.getToken();
      
      return NextResponse.json({
        status: 'active',
        message: 'Shiprocket API is available',
        color: 'green'
      });
    } catch (error) {
      const isBlocked = error.message.includes('blocked') || error.message.includes('User blocked');
      
      return NextResponse.json({
        status: isBlocked ? 'blocked' : 'error',
        message: isBlocked 
          ? 'Account temporarily blocked. Use manual entry or wait 30 minutes.'
          : 'Shiprocket API error. Use manual entry.',
        error: error.message,
        color: 'red'
      });
    }

  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to check status',
      color: 'gray'
    }, { status: 500 });
  }
}
