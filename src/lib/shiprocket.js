class ShiprocketService {
  constructor() {
    this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
    this.token = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      console.log('🔑 Authenticating with Shiprocket...');
      
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "harshrao724@gmail.com",
          password: "3^sIgyjr@Nfn8@Jg"
        })
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Authentication failed');
      }

      this.token = data.token;
      this.tokenExpiry = Date.now() + (240 * 60 * 60 * 1000); // 10 days

      console.log('✅ Shiprocket authenticated successfully');
      return this.token;
    } catch (error) {
      console.error('❌ Shiprocket auth error:', error.message);
      throw error;
    }
  }

  async makeRequest(endpoint, options = {}) {
    const token = await this.getToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Create order
  async createOrder(orderData) {
    return await this.makeRequest('/orders/create/adhoc', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Get courier serviceability
  async getCourierServiceability(pickupPincode, deliveryPincode, weight, cod = 0) {
    const params = new URLSearchParams({
      pickup_postcode: pickupPincode,
      delivery_postcode: deliveryPincode,
      weight: weight,
      cod: cod
    });

    return await this.makeRequest(`/courier/serviceability/?${params}`);
  }

  // Assign AWB
  async assignAWB(shipmentId, courierId) {
    return await this.makeRequest('/courier/assign/awb', {
      method: 'POST',
      body: JSON.stringify({
        shipment_id: shipmentId,
        courier_id: courierId
      })
    });
  }

  // Generate pickup
  async generatePickup(shipmentId) {
    return await this.makeRequest('/courier/generate/pickup', {
      method: 'POST',
      body: JSON.stringify({
        shipment_id: [shipmentId]
      })
    });
  }

  // Generate label
  async generateLabel(shipmentId) {
    return await this.makeRequest('/courier/generate/label', {
      method: 'POST',
      body: JSON.stringify({
        shipment_id: [shipmentId]
      })
    });
  }

  // Track shipment
  async trackShipment(awbCode) {
    return await this.makeRequest(`/courier/track/awb/${awbCode}`);
  }

  // Cancel order
  async cancelOrder(orderId) {
    return await this.makeRequest('/orders/cancel', {
      method: 'POST',
      body: JSON.stringify({
        ids: [orderId]
      })
    });
  }

  // Generate manifest
  async generateManifest(shipmentId) {
    return await this.makeRequest('/manifests/generate', {
      method: 'POST',
      body: JSON.stringify({
        shipment_id: [shipmentId]
      })
    });
  }

  // Print manifest
  async printManifest(orderId) {
    return await this.makeRequest('/manifests/print', {
      method: 'POST',
      body: JSON.stringify({
        order_ids: [orderId]
      })
    });
  }

  // Print invoice
  async printInvoice(orderId) {
    return await this.makeRequest('/orders/print/invoice', {
      method: 'POST',
      body: JSON.stringify({
        ids: [orderId]
      })
    });
  }
}

const shiprocketService = new ShiprocketService();
export default shiprocketService;
