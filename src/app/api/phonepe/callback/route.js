import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { verifyPhonePePayment } from '@/lib/phonepe';
import crypto from 'crypto';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log('📱 PhonePe Callback received:', body);

    // Verify callback signature
    const receivedChecksum = req.headers.get('X-VERIFY');
    const merchantTransactionId = body.transactionId || body.merchantTransactionId;

    // Verify payment status
    const verificationResult = await verifyPhonePePayment(merchantTransactionId);

    if (!verificationResult.success) {
      console.error('❌ Payment verification failed');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed?reason=${verificationResult.message}`
      );
    }

    const paymentData = verificationResult.data;
    
    // Extract order ID from merchant transaction ID
    const orderId = merchantTransactionId.split('_')[1];

    // Check if order already exists
    const existingOrder = await Order.findOne({ orderId });
    
    if (existingOrder) {
      console.log('⚠️ Order already exists:', orderId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/order-success?orderId=${orderId}`
      );
    }

    // Get order data from session/temp storage or reconstruct
    // You might want to store orderData temporarily when initiating payment
    
    // For now, redirect to order success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-processing?txnId=${merchantTransactionId}`
    );

  } catch (error) {
    console.error('❌ PhonePe callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed`
    );
  }
}

export async function GET(req) {
  // Handle GET callback
  const searchParams = req.nextUrl.searchParams;
  const merchantTransactionId = searchParams.get('merchantTransactionId');
  
  if (merchantTransactionId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-processing?txnId=${merchantTransactionId}`
    );
  }
  
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed`
  );
}
