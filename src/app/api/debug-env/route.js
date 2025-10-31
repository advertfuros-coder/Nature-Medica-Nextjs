import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasShiprocketEmail: !!process.env.SHIPROCKET_EMAIL,
    shiprocketEmail: process.env.SHIPROCKET_EMAIL,
    hasShiprocketPassword: !!process.env.SHIPROCKET_PASSWORD,
    passwordLength: process.env.SHIPROCKET_PASSWORD?.length,
    passwordPreview: process.env.SHIPROCKET_PASSWORD ? 
      process.env.SHIPROCKET_PASSWORD.substring(0, 2) + '***' + process.env.SHIPROCKET_PASSWORD.slice(-2) : 
      'MISSING'
  });
}
