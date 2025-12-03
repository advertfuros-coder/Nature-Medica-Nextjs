// Test Ekart Authentication
import ekartAPI from './src/lib/ekart.js';

async function testEkartAuth() {
  try {
    console.log('🔐 Testing Ekart authentication...');
    console.log('Client ID:', process.env.EKART_CLIENT_ID);
    console.log('Username:', process.env.EKART_USERNAME);
    
    const token = await ekartAPI.getAccessToken();
    
    if (token) {
      console.log('✅ Authentication successful!');
      console.log('Access Token:', token.substring(0, 20) + '...');
      console.log('\n🎉 Ekart integration is working!');
    }
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Check if CLIENT_ID is correct');
    console.log('2. Verify username/password');
    console.log('3. Ensure credentials are for API access (not just login)');
  }
}

testEkartAuth();
