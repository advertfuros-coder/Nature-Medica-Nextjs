const https = require('https');

const email = 'mylearning2609@gmail.com';
const password = 'mwKvV$w8s4Y0SXFH'; // Get from Shiprocket dashboard

const data = JSON.stringify({ email, password });

const options = {
  hostname: 'apiv2.shiprocket.in',
  path: '/v1/external/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🔑 Testing with mylearning2609@gmail.com...\n');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const json = JSON.parse(body);
    if (json.token) {
      console.log('✅ SUCCESS!');
      console.log('Token:', json.token.substring(0, 50) + '...');
    } else {
      console.log('❌ FAILED:', json);
    }
  });
});

req.on('error', (error) => console.error('Error:', error));
req.write(data);
req.end();
