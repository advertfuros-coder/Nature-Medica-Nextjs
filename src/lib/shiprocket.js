const SHIPROCKET_API = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken = null;
let tokenExpiry = null;

class ShiprocketService {
  static async getToken() {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return cachedToken;
    }

    try {
      const response = await fetch(`${SHIPROCKET_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "genforgestudio@gmail.com",
          password: "aRak8jMQLmY*Ll^f",
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

  static async createOrder(orderData) {
    try {
      const token = await this.getToken();

      console.log('📦 Creating Shiprocket order:', orderData.order_id);

      const response = await fetch(`${SHIPROCKET_API}/orders/create/adhoc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Shiprocket order creation failed:', data);
        throw new Error(data.message || JSON.stringify(data.errors || data));
      }

      console.log('✅ Shiprocket order created:', data.order_id);
      return data;
    } catch (error) {
      console.error('❌ Shiprocket order error:', error);
      throw error;
    }
  }

  static async getCourierServiceability(pickupPincode, deliveryPincode, weight, cod, orderValue) {
    try {
      const token = await this.getToken();

      const params = new URLSearchParams({
        pickup_postcode: pickupPincode,
        delivery_postcode: deliveryPincode,
        weight: weight,
        cod: cod ? '1' : '0',
        declared_value: orderValue
      });

      const response = await fetch(`${SHIPROCKET_API}/courier/serviceability?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get courier serviceability');
      }

      return data.data;
    } catch (error) {
      console.error('❌ Failed to get courier serviceability:', error);
      throw error;
    }
  }

  static async generateAWB(shipmentId, courierId) {
    try {
      const token = await this.getToken();

      const response = await fetch(`${SHIPROCKET_API}/courier/assign/awb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_id: shipmentId,
          courier_id: courierId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate AWB');
      }

      console.log('✅ AWB generated:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to generate AWB:', error);
      throw error;
    }
  }

  static async schedulePickup(shipmentId) {
    try {
      const token = await this.getToken();

      const response = await fetch(`${SHIPROCKET_API}/courier/generate/pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shipment_id: [shipmentId] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to schedule pickup');
      }

      console.log('✅ Pickup scheduled:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to schedule pickup:', error);
      throw error;
    }
  }

  static async getShippingLabel(shipmentIds) {
    try {
      const token = await this.getToken();

      const response = await fetch(`${SHIPROCKET_API}/courier/generate/label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_id: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get shipping label');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to get shipping label:', error);
      throw error;
    }
  }

  static async trackShipment(awb) {
    try {
      const token = await this.getToken();

      const response = await fetch(`${SHIPROCKET_API}/courier/track/awb/${awb}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to track shipment');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to track shipment:', error);
      throw error;
    }
  }

  static async cancelShipment(awbs) {
    try {
      const token = await this.getToken();

      const response = await fetch(`${SHIPROCKET_API}/orders/cancel/shipment/awbs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          awbs: Array.isArray(awbs) ? awbs : [awbs]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel shipment');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to cancel shipment:', error);
      throw error;
    }
  }

  static async createReturn(returnData) {
    try {
      const token = await this.getToken();

      const response = await fetch(`${SHIPROCKET_API}/orders/create/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(returnData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create return');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to create return:', error);
      throw error;
    }
  }

  static async getShipments(page = 1, perPage = 20) {
    try {
      const token = await this.getToken();

      const params = new URLSearchParams({ page, per_page: perPage });

      const response = await fetch(`${SHIPROCKET_API}/shipments?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get shipments');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to get shipments:', error);
      throw error;
    }
  }
}

export default ShiprocketService;
