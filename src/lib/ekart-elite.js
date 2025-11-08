class EkartEliteService {
  constructor() {
    this.clientId = process.env.EKART_CLIENT_ID;
    this.clientName = process.env.EKART_CLIENT_NAME;
    this.baseURL = process.env.EKART_ENV === 'production'
      ? 'https://app.elite.ekartlogistics.in/api'
      : 'https://staging.elite.ekartlogistics.in/api';
    this.token = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    // Token caching - expires in 55 minutes
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      console.log('🔑 Getting Ekart Elite token...');

      // For Ekart Elite, authentication might be different
      // Check the API docs at https://app.elite.ekartlogistics.in/api/docs
      // This is a common pattern for token generation
      const response = await fetch(`${this.baseURL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': this.clientId
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_name: this.clientName
        })
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Failed to get token');
      }

      this.token = data.token;
      this.tokenExpiry = Date.now() + (55 * 60 * 1000); // 55 minutes

      console.log('✅ Ekart Elite token obtained');
      return this.token;
    } catch (error) {
      console.error('❌ Ekart token error:', error.message);
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
        'X-Client-Id': this.clientId,
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  }

  // Check serviceability
  async checkServiceability(originPincode, destinationPincode, weight = 0.5) {
    const params = new URLSearchParams({
      origin_pincode: originPincode,
      destination_pincode: destinationPincode,
      weight: weight.toString(),
      delivery_type: 'SMALL'
    });

    return await this.makeRequest(`/serviceability?${params}`);
  }

  // Create shipment
  async createShipment(shipmentData) {
    return await this.makeRequest('/shipments/create', {
      method: 'POST',
      body: JSON.stringify({
        ...shipmentData,
        client_id: this.clientId,
        client_name: this.clientName
      })
    });
  }

  // Track shipment
  async trackShipment(trackingId) {
    return await this.makeRequest(`/shipments/track/${trackingId}`);
  }

  // Cancel shipment
  async cancelShipment(trackingId) {
    return await this.makeRequest(`/shipments/cancel/${trackingId}`, {
      method: 'POST'
    });
  }

  // Get label
  async getLabel(trackingId) {
    return await this.makeRequest(`/shipments/label/${trackingId}`);
  }

  // Get manifest
  async getManifest(trackingIds) {
    return await this.makeRequest('/shipments/manifest', {
      method: 'POST',
      body: JSON.stringify({
        tracking_ids: Array.isArray(trackingIds) ? trackingIds : [trackingIds]
      })
    });
  }
}

const ekartEliteService = new EkartEliteService();
export default ekartEliteService;
