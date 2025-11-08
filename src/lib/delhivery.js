class DelhiveryService {
  constructor() {
    this.token = process.env.DELHIVERY_API_TOKEN;
    // Use production URL - staging may not be available for your account
    this.baseURL = 'https://track.delhivery.com/api';
    this.clientName = process.env.DELHIVERY_CLIENT_NAME || 'Nature Medica';
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      console.log('🚚 Delhivery Request:', {
        method: options.method || 'GET',
        url: url.split('?')[0]
      });

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.token}`,
          ...options.headers
        }
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { raw: text };
      }

      if (!response.ok) {
        console.error('❌ Delhivery Error:', {
          status: response.status,
          data
        });
        throw new Error(data.error || data.message || text || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Check pincode serviceability
  async checkPincodeServiceability(pincode) {
    return await this.makeRequest(
      `/c/api/pin-codes/json/?filter_codes=${pincode}`
    );
  }

  // Fetch waybill
  async fetchWaybill() {
    const params = new URLSearchParams({
      cl: this.clientName,
      count: '1'
    });

    return await this.makeRequest(`/cmu/push/json/?${params}`);
  }

  // Create shipment
  async createShipment(shipmentData) {
    const formData = new URLSearchParams();
    formData.append('format', 'json');
    formData.append('data', JSON.stringify(shipmentData));

    return await this.makeRequest('/cmu/create.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Token ${this.token}`
      },
      body: formData.toString()
    });
  }

  // Track shipment
  async trackShipment(waybill) {
    return await this.makeRequest(
      `/v1/packages/json/?waybill=${waybill}`
    );
  }

  // Cancel shipment
  async cancelShipment(waybill) {
    const formData = new URLSearchParams({
      waybill: waybill,
      cancellation: 'true'
    });

    return await this.makeRequest('/p/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Token ${this.token}`
      },
      body: formData.toString()
    });
  }

  // Generate label URL
  generateLabelUrl(waybill) {
    return `${this.baseURL}/p/packing_slip?wbns=${waybill}&pdf=true`;
  }

  // Generate invoice URL
  generateInvoiceUrl(waybill) {
    return `${this.baseURL}/p/invoice?wbns=${waybill}&pdf=true`;
  }
}

const delhiveryService = new DelhiveryService();
export default delhiveryService;
