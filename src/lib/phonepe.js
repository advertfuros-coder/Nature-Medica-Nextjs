import crypto from 'crypto';
import axios from 'axios';

// Correct PhonePe API URLs
const PHONEPE_HOST = process.env.PHONEPE_ENV === 'production' 
  ? 'https://api.phonepe.com/apis/hermes'  // Production
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';  // UAT/Sandbox

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

export const initiatePhonePePayment = async (orderId, amount, userId, userPhone, userEmail) => {
  try {
    const merchantTransactionId = `TXN_${orderId}_${Date.now()}`;
    
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepe/callback`,
      redirectMode: 'REDIRECT',  // Changed from POST to REDIRECT
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepe/callback`,
      mobileNumber: userPhone,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('PhonePe Initiation:', {
      env: process.env.PHONEPE_ENV,
      host: PHONEPE_HOST,
      merchantId: MERCHANT_ID,
      transactionId: merchantTransactionId,
      amount: payload.amount
    });

    // Base64 encode the payload
    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString('base64');
    
    // Generate checksum: base64Payload + endpoint + saltKey
    const checksumString = base64Payload + '/pg/v1/pay' + SALT_KEY;
    const sha256Hash = crypto.createHash('sha256').update(checksumString).digest('hex');
    const checksum = sha256Hash + '###' + SALT_INDEX;

    console.log('Request to:', `${PHONEPE_HOST}/pg/v1/pay`);

    // Make API request
    const response = await axios.post(
      `${PHONEPE_HOST}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'accept': 'application/json'
        }
      }
    );

    console.log('PhonePe Response:', response.data);

    if (response.data.success) {
      return {
        success: true,
        paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId
      };
    } else {
      throw new Error(response.data.message || 'Payment initiation failed');
    }
  } catch (error) {
    console.error('PhonePe Payment Error Details:', {
      status: error.response?.status,
        
      message: error.message
    });
    throw error;
  }
};

export const verifyPhonePePayment = async (merchantTransactionId) => {
  try {
    // Generate checksum for status check
    const checksumString = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY;
    const sha256Hash = crypto.createHash('sha256').update(checksumString).digest('hex');
    const checksum = sha256Hash + '###' + SALT_INDEX;

    const response = await axios.get(
      `${PHONEPE_HOST}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': MERCHANT_ID,
          'accept': 'application/json'
        }
      }
    );

    console.log('PhonePe Verification Response:', response.data);

    return {
      success: response.data.success,
      code: response.data.code,
      message: response.data.message,
       response: response.data.data
    };
  } catch (error) {
    console.error('PhonePe Verification Error:', error.response?.data || error.message);
    throw error;
  }
};
