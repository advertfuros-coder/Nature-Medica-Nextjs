const https = require('https');

// Replace with your actual credentials
const authorization = 'Basic YOUR_BASE64_CREDENTIALS';
const merchantCode = 'XBS'; // Your merchant code

const data = JSON.stringify({
  merchant_code: merchantCode
});

const options = {
  hostname: 'staging.ekartlogistics.com',
  path: '/v2/auth/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': authorization,
    'Content-Length': data.length
  }
};

console.log('🔍 Testing Ekart API...\n');
console.log('Merchant Code:', merchantCode);
console.log('Environment: Staging\n');

const req = https.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(body);
        if (json.token) {
          console.log('\n✅ SUCCESS! Ekart API is working\n');
          console.log('Token obtained:', json.token.substring(0, 30) + '...');
          console.log('Token expires in: 60 minutes');
        } else {
          console.log('\n❌ No token received');
        }
      } catch (e) {
        console.log('\n❌ Failed to parse response');
      }
    } else {
      console.log('\n❌ FAILED:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request Error:', error.message);
});

req.write(data);
req.end();
