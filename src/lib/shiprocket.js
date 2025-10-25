/**
 * Shiprocket API Integration - Auto Address Handling
 */

let cachedToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: "l4$85TzOjczTw@@f",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Shiprocket auth failed: ${data.message || JSON.stringify(data)}`);
    }

    cachedToken = data.token;
    tokenExpiry = Date.now() + (10 * 24 * 60 * 60 * 1000);

    console.log('✅ Shiprocket authenticated');
    return cachedToken;
  } catch (error) {
    console.error('❌ Shiprocket auth error:', error);
    throw error;
  }
}

/**
 * Validate and clean address data
 */
function validateAddress(address, type = 'shipping') {
  if (!address) {
    throw new Error(`${type} address is missing`);
  }

  const required = ['street', 'city', 'state', 'pincode', 'phone'];
  const missing = required.filter(field => !address[field]);

  if (missing.length > 0) {
    throw new Error(`${type} address missing fields: ${missing.join(', ')}`);
  }

  return {
    street: String(address.street).trim(),
    city: String(address.city).trim(),
    state: String(address.state).trim(),
    pincode: String(address.pincode).trim(),
    phone: String(address.phone).trim()
  };
}

/**
 * Create forward shipment (order delivery)
 */
export async function createShiprocketOrder(orderData) {
  try {
    const token = await getShiprocketToken();

    // Validate shipping address
    const address = validateAddress(orderData.shippingAddress, 'Shipping');

    const shiprocketPayload = {
      order_id: orderData.orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary",
      channel_id: "",
      comment: "NatureMedica Order",
      
      // Billing = Customer address (from order)
      billing_customer_name: orderData.customer.name || "Customer",
      billing_last_name: "",
      billing_address: address.street,
      billing_address_2: "",
      billing_city: address.city,
      billing_pincode: address.pincode,
      billing_state: address.state,
      billing_country: "India",
      billing_email: orderData.customer.email || "customer@example.com",
      billing_phone: address.phone,
      
      // Shipping same as billing (customer address)
      shipping_is_billing: true,
      shipping_customer_name: "",
      shipping_last_name: "",
      shipping_address: "",
      shipping_address_2: "",
      shipping_city: "",
      shipping_pincode: "",
      shipping_country: "",
      shipping_state: "",
      shipping_email: "",
      shipping_phone: "",
      
      order_items: orderData.items.map((item, idx) => ({
        name: item.title || `Product ${idx + 1}`,
        sku: item.product || `SKU-${idx + 1}`,
        units: item.quantity || 1,
        selling_price: String(item.price),
        discount: "0",
        tax: "0",
        hsn: ""
      })),
      
      payment_method: orderData.paymentMode === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: "0",
      giftwrap_charges: "0",
      transaction_charges: "0",
      total_discount: String(orderData.discount || 0),
      sub_total: String(orderData.totalPrice),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    console.log('📦 Creating Shiprocket order:', orderData.orderId);

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(shiprocketPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Shiprocket order failed:', data);
      throw new Error(data.message || JSON.stringify(data.errors || data));
    }

    console.log('✅ Shiprocket order created:', data.order_id);

    return {
      success: true,
      shiprocketOrderId: data.order_id,
      shipmentId: data.shipment_id,
      awb: data.awb_code || 'Pending',
      courierName: data.courier_name || 'To be assigned'
    };
  } catch (error) {
    console.error('❌ Shiprocket order error:', error);
    throw error;
  }
}

/**
 * Schedule return pickup (reverse shipment)
 * Pickup FROM customer address, Deliver TO warehouse
 */
export async function scheduleShiprocketPickup(pickupData) {
  try {
    const token = await getShiprocketToken();

    // Validate customer address (pickup location)
    const customerAddress = validateAddress(pickupData.address, 'Pickup');

    // Warehouse address for returns
    const warehouseAddress = {
      name: "NatureMedica Warehouse",
      address: process.env.WAREHOUSE_ADDRESS || "Warehouse Address Line 1",
      city: process.env.WAREHOUSE_CITY || "Delhi",
      state: process.env.WAREHOUSE_STATE || "Delhi",
      pincode: process.env.WAREHOUSE_PINCODE || "110001",
      phone: process.env.WAREHOUSE_PHONE || "9999999999",
      email: process.env.SHIPROCKET_EMAIL
    };

    const pickupPayload = {
      order_id: `RET-${pickupData.returnId || pickupData.orderId}-${Date.now()}`,
      order_date: new Date().toISOString().split('T')[0],
      channel_id: "",
      
      // PICKUP FROM customer (original delivery address)
      pickup_customer_name: pickupData.customer.name || "Customer",
      pickup_last_name: "",
      pickup_address: customerAddress.street,
      pickup_address_2: "",
      pickup_city: customerAddress.city,
      pickup_state: customerAddress.state,
      pickup_country: "India",
      pickup_pincode: customerAddress.pincode,
      pickup_email: pickupData.customer.email,
      pickup_phone: customerAddress.phone,
      
      // DELIVER TO warehouse
      shipping_is_billing: false,
      billing_customer_name: warehouseAddress.name,
      billing_last_name: "",
      billing_address: warehouseAddress.address,
      billing_address_2: "",
      billing_city: warehouseAddress.city,
      billing_pincode: warehouseAddress.pincode,
      billing_state: warehouseAddress.state,
      billing_country: "India",
      billing_email: warehouseAddress.email,
      billing_phone: warehouseAddress.phone,
      
      order_items: pickupData.items.map((item, idx) => ({
        name: item.title,
        sku: item.product || `RET-${idx + 1}`,
        units: item.quantity,
        selling_price: String(item.price),
        discount: "0",
        tax: "0"
      })),
      
      payment_method: "Prepaid",
      sub_total: String(pickupData.totalAmount),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    console.log('📦 Scheduling return pickup:', pickupData.orderId);

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/return', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(pickupPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Shiprocket pickup failed:', data);
      throw new Error(data.message || JSON.stringify(data.errors || data));
    }

    console.log('✅ Return pickup scheduled:', data.order_id);

    return {
      success: true,
      pickupId: data.order_id,
      awb: data.awb_code || 'Pending'
    };
  } catch (error) {
    console.error('❌ Shiprocket pickup error:', error);
    throw error;
  }
}

/**
 * Track shipment
 */
export async function trackShipment(awbCode) {
  try {
    const token = await getShiprocketToken();

    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Tracking failed');
    }

    return { success: true, tracking: data.tracking_data };
  } catch (error) {
    console.error('❌ Tracking error:', error);
    throw error;
  }
}


/**
 * Ensure pickup location exists, create if not
 */
export async function ensurePickupLocation() {
  try {
    const token = await getShiprocketToken();

    // Check if pickup location "Primary" exists
    const checkResponse = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const existingPickups = await checkResponse.json();

    // Check if "Primary" pickup location exists
    const primaryExists = existingPickups.data?.shipping_address?.some(
      addr => addr.pickup_location === 'Primary'
    );

    if (primaryExists) {
      console.log('✅ Pickup location "Primary" already exists');
      return { success: true, message: 'Pickup location exists' };
    }

    // Create pickup location if not exists
    console.log('📍 Creating pickup location "Primary"...');

    const createPayload = {
      pickup_location: "Primary",
      name: process.env.COMPANY_NAME || "NatureMedica",
      email: process.env.SHIPROCKET_EMAIL,
      phone: process.env.WAREHOUSE_PHONE || "9999999999",
      address: process.env.WAREHOUSE_ADDRESS || "123 Warehouse Street",
      address_2: "",
      city: process.env.WAREHOUSE_CITY || "Delhi",
      state: process.env.WAREHOUSE_STATE || "Delhi",
      country: "India",
      pin_code: process.env.WAREHOUSE_PINCODE || "110001"
    };

    const createResponse = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/addpickup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(createPayload),
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      throw new Error(createData.message || 'Failed to create pickup location');
    }

    console.log('✅ Pickup location "Primary" created successfully');
    return { success: true, message: 'Pickup location created' };

  } catch (error) {
    console.error('❌ Pickup location setup error:', error);
    throw error;
  }
}
