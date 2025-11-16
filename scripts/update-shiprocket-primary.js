// Update Primary address with real Lucknow details
require('dotenv').config();

async function getShiprocketToken() {
  const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    })
  });
  
  const data = await response.json();
  
  if (!data.token) {
    throw new Error('Authentication failed: ' + JSON.stringify(data));
  }
  
  return data.token;
}

async function updatePrimaryAddress() {
  try {
    console.log('🔑 Authenticating with Shiprocket...');
    const token = await getShiprocketToken();
    console.log('✅ Authenticated successfully\n');
    
    // Get all pickup locations to find Primary ID
    console.log('📋 Fetching current pickup locations...');
    const locationsRes = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!locationsRes.ok) {
      throw new Error(`HTTP ${locationsRes.status}: ${await locationsRes.text()}`);
    }
    
    const locationsData = await locationsRes.json();
    
    // Debug: Show the actual response structure
    console.log('API Response:', JSON.stringify(locationsData, null, 2).substring(0, 500) + '...\n');
    
    // Handle different response structures
    let locations;
    
    if (locationsData.data && locationsData.data.shipping_address) {
      locations = locationsData.data.shipping_address;
    } else if (locationsData.shipping_address) {
      locations = locationsData.shipping_address;
    } else if (Array.isArray(locationsData.data)) {
      locations = locationsData.data;
    } else if (Array.isArray(locationsData)) {
      locations = locationsData;
    } else {
      console.log('❌ Unexpected API response structure');
      console.log('Full response:', JSON.stringify(locationsData, null, 2));
      throw new Error('Could not find pickup locations in API response');
    }
    
    if (!locations || locations.length === 0) {
      console.log('❌ No pickup locations found!');
      return;
    }
    
    console.log(`Found ${locations.length} pickup locations:\n`);
    locations.forEach((loc, idx) => {
      console.log(`${idx + 1}. ${loc.pickup_location || loc.name} - ${loc.city} (ID: ${loc.id})`);
    });
    console.log('');
    
    // Find the Primary (Delhi) address
    const primaryLocation = locations.find(loc => 
      loc.pickup_location === 'Primary' || 
      loc.city === 'Delhi' ||
      (loc.address && loc.address.includes('123 Warehouse'))
    );
    
    if (!primaryLocation) {
      console.log('⚠️ Primary/Delhi address not found!');
      console.log('💡 Available addresses:', locations.map(l => l.pickup_location).join(', '));
      console.log('\nYou may need to manually create or edit an address.');
      return;
    }
    
    console.log(`✅ Found target address to update:`);
    console.log(`   Name: ${primaryLocation.pickup_location}`);
    console.log(`   Current: ${primaryLocation.address}, ${primaryLocation.city}`);
    console.log(`   ID: ${primaryLocation.id}\n`);
    
    // Prepare updated address data with your real Lucknow details
    const updatedAddress = {
      pickup_location: 'Primary', // Keep the name as Primary
      name: 'Nature Medica',
      email: process.env.SHIPROCKET_EMAIL || 'info@naturemedica.com',
      phone: '8400043322',
      address: '1st Floor, LHPS Building, Friends Colony, Sector-7',
      address_2: 'Kamla Nehru Nagar, Vikas Nagar',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      country: 'India',
      pin_code: '226022',
      id: primaryLocation.id // Include ID to update existing address
    };
    
    console.log('🔄 Updating address with Lucknow details...\n');
    console.log('📍 New address:');
    console.log(`   Name: ${updatedAddress.name}`);
    console.log(`   Phone: ${updatedAddress.phone}`);
    console.log(`   Address Line 1: ${updatedAddress.address}`);
    console.log(`   Address Line 2: ${updatedAddress.address_2}`);
    console.log(`   City: ${updatedAddress.city}, ${updatedAddress.state}`);
    console.log(`   Pincode: ${updatedAddress.pin_code}\n`);
    
    // Update the address
    const updateRes = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/addpickup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedAddress)
    });
    
    const updateData = await updateRes.json();
    
    console.log('📤 Update response:', JSON.stringify(updateData, null, 2).substring(0, 300) + '...\n');
    
    if (updateRes.ok && updateData.success) {
      console.log('✅ PRIMARY ADDRESS UPDATED SUCCESSFULLY!');
      console.log('📍 Address ID:', updateData.address_id || primaryLocation.id);
      console.log('\n🎉 Done! Your Primary pickup location now has the correct Lucknow address.');
      console.log('\n⚠️ Important next steps:');
      console.log('   1. Go to: https://app.shiprocket.in/settings/pickup-addresses');
      console.log('   2. Find "Primary" address');
      console.log('   3. Click "Verify Address" button to verify with Shiprocket');
      console.log('   4. Once verified, you can start creating shipments!');
    } else {
      console.log('⚠️ Update may have failed or returned warnings\n');
      
      if (updateData.errors) {
        console.log('❌ Validation errors:');
        Object.entries(updateData.errors).forEach(([field, messages]) => {
          console.log(`   ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
        });
      }
      
      if (updateData.message) {
        console.log('📝 Message:', updateData.message);
      }
      
      console.log('\n💡 Manual fix (takes 2 minutes):');
      console.log('   1. Go to: https://app.shiprocket.in/settings/pickup-addresses');
      console.log('   2. Click "Edit" on "Primary" address');
      console.log('   3. Enter these details:');
      console.log('      - Name: Nature Medica');
      console.log('      - Phone: 8400043322');
      console.log('      - Address: 1st Floor, LHPS Building, Friends Colony, Sector-7');
      console.log('      - Address 2: Kamla Nehru Nagar, Vikas Nagar');
      console.log('      - City: Lucknow');
      console.log('      - State: Uttar Pradesh');
      console.log('      - Pincode: 226022');
      console.log('   4. Click "Verify Address" and "Save"');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    console.log('\n💡 Quick fix options:');
    console.log('   1. Check your .env file has correct SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD');
    console.log('   2. Or update manually in dashboard: https://app.shiprocket.in/settings/pickup-addresses');
  }
}

// Check Node.js version and use appropriate fetch
(async () => {
  if (typeof fetch === 'undefined') {
    // For Node < 18
    global.fetch = (await import('node-fetch')).default;
  }
  await updatePrimaryAddress();
})();
