const https = require('https');

const clientId = 'EKART_6908625194d105d9ba15353f';
const clientName = 'Avanikart Trading Private Limited';

const data = JSON.stringify({
  client_id: clientId,
  client_name: clientName
});

const options = {
  hostname: 'app.elite.ekartlogistics.in',
  path: '/api/auth/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Id': clientId,
    'Content-Length': data.length
  }
};

console.log('🔍 Testing Ekart Elite API...\n');
console.log('Client ID:', clientId);
console.log('Client Name:', clientName);
console.log('Environment: Production\n');

const req = https.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', body.substring(0, 300));
    
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(body);
        if (json.token) {
          console.log('\n✅ SUCCESS! Ekart Elite API is working\n');
          console.log('Token obtained:', json.token.substring(0, 30) + '...');
        } else {
          console.log('\n⚠️ Response received but no token found');
        }
      } catch (e) {
        console.log('\n❌ Failed to parse JSON response');
      }
    } else if (res.statusCode === 401) {
      console.log('\n❌ Authentication failed - Invalid credentials');
      console.log('Please verify Client ID with your account manager');
      console.log('Contact: Vivek - vivekkumar27.vc@flipkart.com');
    } else if (res.statusCode === 404) {
      console.log('\n❌ Endpoint not found');
      console.log('API documentation might be different');
      console.log('Check: https://app.elite.ekartlogistics.in/api/docs');
    } else {
      console.log('\n❌ Request failed');
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request Error:', error.message);
});

req.write(data);
req.end();
