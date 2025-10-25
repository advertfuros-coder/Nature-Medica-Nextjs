import { NextResponse } from 'next/server';
import { testEmailConnection, sendOrderConfirmation } from '@/lib/email';

export async function POST(req) {
  try {
    const { type, email, name } = await req.json();

    // Test connection
    const connectionTest = await testEmailConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        error: 'Email server connection failed',
        details: connectionTest.error
      }, { status: 500 });
    }

    // Send test email
    if (type === 'order') {
      const testOrderDetails = {
        items: [
          { title: 'Test Product', quantity: 2, price: 299 }
        ],
        finalPrice: 598
      };

      await sendOrderConfirmation(
        email,
        name,
        'TEST001',
        testOrderDetails
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`
    });

  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
