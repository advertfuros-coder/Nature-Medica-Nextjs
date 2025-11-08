import { NextResponse } from 'next/server';
import shiprocketService from '@/lib/shiprocket';

export async function GET() {
  try {
    const token = await shiprocketService.getToken();
    
    return NextResponse.json({
      status: 'active',
      message: 'Shiprocket API is working properly',
      tokenExists: !!token
    });
  } catch (error) {
    console.error('Shiprocket status check failed:', error);
    
    const isBlocked = error.message?.includes('blocked') || 
                     error.message?.includes('failed login') ||
                     error.message?.includes('Invalid credentials');
    
    return NextResponse.json({
      status: isBlocked ? 'blocked' : 'error',
      message: isBlocked 
        ? 'Account blocked or invalid credentials. Check your API user settings.'
        : 'Shiprocket API connection error.',
      suggestion: 'Use Delhivery or Manual Entry for shipments.',
      error: error.message
    }, { status: 500 });
  }
}
