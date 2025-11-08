class EkartService {
  constructor() {
    this.merchantCode = process.env.EKART_MERCHANT_CODE;
    this.authorization = process.env.EKART_AUTHORIZATION;
    this.serviceCode = process.env.EKART_SERVICE_CODE || 'REGULAR';
    this.reverseServiceCode = process.env.EKART_REVERSE_SERVICE_CODE || 'REVERSE';
    this.baseURL = process.env.EKART_ENV === 'production'
      ? 'https://api.ekartlogistics.com'
      : 'https://staging.ekartlogistics.com';
    this.token = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    // Token expires in 60 minutes
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      console.log('🔑 Getting Ekart token...');

      const response = await fetch(`${this.baseURL}/v2/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authorization
        },
        body: JSON.stringify({
          merchant_code: this.merchantCode
        })
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Failed to get token');
      }

      this.token = data.token;
      this.tokenExpiry = Date.now() + (55 * 60 * 1000); // 55 minutes

      console.log('✅ Ekart token obtained');
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
  async checkServiceability(sellerPincode, customerPincode, weight = 1) {
    const params = new URLSearchParams({
      seller_pincode: sellerPincode,
      customer_pincode: customerPincode,
      weight: weight.toString(),
      service_type: 'FORWARD'
    });

    return await this.makeRequest(`/v1/offerings?${params}`);
  }

  // Create forward shipment
  async createForwardShipment(shipmentData) {
    return await this.makeRequest('/v2/shipments/create', {
      method: 'POST',
      body: JSON.stringify({
        ...shipmentData,
        service_type: 'FORWARD',
        service_code: this.serviceCode
      })
    });
  }

  // Create reverse shipment
  async createReverseShipment(shipmentData) {
    return await this.makeRequest('/v2/shipments/create', {
      method: 'POST',
      body: JSON.stringify({
        ...shipmentData,
        service_type: 'REVERSE',
        service_code: this.reverseServiceCode
      })
    });
  }

  // Track shipment
  async trackShipment(referenceId) {
    return await this.makeRequest(`/v2/shipments/track/${referenceId}`);
  }

  // Cancel shipment
  async cancelShipment(referenceId) {
    return await this.makeRequest(`/v2/shipments/cancel/${referenceId}`, {
      method: 'POST'
    });
  }

  // Get label
  async getLabel(referenceId) {
    return await this.makeRequest(`/v2/shipments/label/${referenceId}`);
  }

  // Get manifest
  async getManifest(referenceIds) {
    return await this.makeRequest('/v2/shipments/manifest', {
      method: 'POST',
      body: JSON.stringify({
        reference_ids: Array.isArray(referenceIds) ? referenceIds : [referenceIds]
      })
    });
  }
}

const ekartService = new EkartService();
export default ekartService;
