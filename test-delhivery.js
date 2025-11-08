const https = require('https');

const token = '6005c6146acd6f82bb3bd031e174cf69f1566eb8';
const testPincode = '400064';

// Try production URL
const options = {
  hostname: 'track.delhivery.com',
  path: `/api/c/api/pin-codes/json/?filter_codes=${testPincode}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  }
};

console.log('🔍 Testing Delhivery API (Production)...\n');
console.log('Token:', token.substring(0, 20) + '...');
console.log('Testing pincode:', testPincode);
console.log('URL: https://track.delhivery.com/api/c/api/pin-codes/json/\n');

const req = https.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', body.substring(0, 200) + (body.length > 200 ? '...' : ''));
    
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(body);
        
        if (json.delivery_codes && json.delivery_codes.length > 0) {
          console.log('\n✅ SUCCESS! Delhivery API is working\n');
          console.log('Pincode Details:');
          console.log('- Pincode:', json.delivery_codes[0].postal_code.pin);
          console.log('- City:', json.delivery_codes[0].postal_code.city);
          console.log('- State:', json.delivery_codes[0].postal_code.state_or_province_code);
          console.log('- COD Available:', json.delivery_codes[0].cod);
        } else {
          console.log('\n⚠️ Pincode not serviceable or no data');
        }
      } catch (e) {
        console.log('\n❌ Failed to parse response');
      }
    } else if (res.statusCode === 401) {
      console.log('\n❌ Authentication failed - Invalid API token');
      console.log('Please verify your Delhivery API token in the dashboard');
    } else if (res.statusCode === 404) {
      console.log('\n❌ Endpoint not found');
      console.log('Your API token may not have access to this endpoint');
      console.log('OR you may need to register a pickup location first');
    } else {
      console.log('\n❌ Request failed');
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request Error:', error.message);
});

req.end();
