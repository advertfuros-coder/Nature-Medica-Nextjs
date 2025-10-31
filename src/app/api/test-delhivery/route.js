import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Testing Delhivery API Connection...\n');

    const apiKey = process.env.DELHIVERY_API_KEY;
    const accountName = process.env.DELHIVERY_ACCOUNT_NAME;

    console.log('📋 Environment Variables:');
    console.log('API Key:', apiKey ? '✅ Present (' + apiKey.length + ' chars)' : '❌ Missing');
    console.log('Account Name:', accountName || '❌ Missing');
    console.log('');

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: '❌ DELHIVERY_API_KEY not set in .env.local',
        hint: 'Add: DELHIVERY_API_KEY=your_key_here'
      }, { status: 400 });
    }

    console.log('🌐 Testing API endpoint: https://track.delhivery.com/api/v1/packages/json/\n');

    const response = await fetch('https://track.delhivery.com/api/v1/packages/json/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Response Status:', response.status, response.statusText);
    console.log('📥 Response Headers:', {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length')
    });
    console.log('');

    const text = await response.text();
    console.log('📝 Response Body (first 500 chars):', text.substring(0, 500));
    console.log('');

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log('⚠️ Response is not valid JSON (likely HTML error page)');
      console.log('Full response:', text);
      
      return NextResponse.json({
        success: false,
        error: '❌ Delhivery API returned invalid response (likely HTML error page)',
        status: response.status,
        suggestion: 'Check if API key is correct or account is activated',
        responsePreview: text.substring(0, 200)
      }, { status: 400 });
    }

    console.log('✅ Valid JSON Response:', data);
    console.log('');

    if (response.ok || response.status === 400) {
      return NextResponse.json({
        success: true,
        message: '✅ Delhivery API connection successful!',
        apiKey: '***' + apiKey.slice(-8),
        accountName: accountName,
        responseStatus: response.status,
        testResult: 'API is reachable and responding'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: '❌ Delhivery API returned error',
        status: response.status,
        response: data
      }, { status: 400 });
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.name,
      suggestion: 'Network error or invalid API endpoint'
    }, { status: 500 });
  }
}
