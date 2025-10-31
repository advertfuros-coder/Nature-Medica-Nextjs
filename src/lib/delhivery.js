class DelhiveryService {
  static BASE_URL = 'https://track.delhivery.com/api';
  static SHIPMENT_CREATE_URL = 'https://track.delhivery.com/api/v1/create/shipment/';
  static TRACKING_URL = 'https://track.delhivery.com/api/v1/packages/json/';

  static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.DELHIVERY_API_KEY}`,
    };
  }

  static async parseResponse(response) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`Invalid JSON response`);
    }
  }

  // Create shipment with smart error handling
  static async createShipment(shipmentData) {
    try {
      console.log('📦 Creating Delhivery shipment:', shipmentData.waybill);

      const payload = {
        shipments: [
          {
            waybill_number: shipmentData.waybill,
            customer_name: shipmentData.name,
            customer_address: shipmentData.address,
            customer_city: shipmentData.city,
            customer_state: shipmentData.state,
            customer_country: 'India',
            customer_pincode: shipmentData.pincode,
            customer_phone: shipmentData.phone,
            customer_email: shipmentData.email,
            order_id: shipmentData.orderId,
            pickup_location_name: process.env.DELHIVERY_ACCOUNT_NAME || 'Primary',
            weight: shipmentData.weight || 0.5,
            consignment_type: shipmentData.isCOD ? 'COD' : 'Prepaid',
            cod_amount: shipmentData.isCOD ? shipmentData.amount : 0,
            declared_value: shipmentData.amount || 0,
            return_name: 'NatureMedica Warehouse',
            return_address: process.env.SHIPROCKET_PICKUP_ADDRESS || 'Warehouse',
            return_city: process.env.SHIPROCKET_PICKUP_CITY || 'Lucknow',
            return_state: process.env.SHIPROCKET_PICKUP_STATE || 'Uttar Pradesh',
            return_pincode: process.env.SHIPROCKET_PICKUP_PINCODE || '226022',
            return_phone: process.env.SHIPROCKET_PICKUP_PHONE || '9876543210',
            return_email: process.env.SHIPROCKET_PICKUP_EMAIL || 'warehouse@naturemedica.com',
            return_country: 'India'
          }
        ]
      };

      console.log('📤 Attempting Delhivery API...');

      const response = await fetch(this.SHIPMENT_CREATE_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      console.log('📥 Response status:', response.status);

      if (response.status === 404) {
        console.warn('⚠️ 404 - Delhivery API endpoint not accessible');
        throw new Error('DELHIVERY_API_UNAVAILABLE');
      }

      const data = await this.parseResponse(response);

      if (response.ok && (data.success || data.shipments)) {
        console.log('✅ Shipment created in Delhivery');
        
        return {
          success: true,
          provider: 'delhivery_api',
          waybill: shipmentData.waybill,
          shipmentId: data.shipments?.[0]?.id || data.id,
          awb: shipmentData.waybill,
          trackingUrl: `https://track.delhivery.com/?awb=${shipmentData.waybill}`
        };
      } else {
        throw new Error(data.error || data.message || 'Shipment creation failed');
      }

    } catch (error) {
      console.error('❌ Delhivery API error:', error.message);
      throw error;
    }
  }

  // Track shipment
  static async trackShipment(waybill) {
    try {
      const response = await fetch(`${this.TRACKING_URL}?waybill=${waybill}`, {
        headers: this.getHeaders()
      });

      const data = await this.parseResponse(response);

      if (data.success && data.data?.length > 0) {
        return {
          success: true,
          tracking: data.data,
          status: data.data[0].status || 'In Transit'
        };
      }
      throw new Error('Shipment not found');
    } catch (error) {
      console.error('❌ Tracking error:', error.message);
      throw error;
    }
  }

  // Get label
  static async getLabel(waybill) {
    return {
      success: true,
      labelUrl: `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}&print=label`,
      pdfUrl: `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}&print=pdf`,
      trackingUrl: `https://track.delhivery.com/?awb=${waybill}`
    };
  }
}

export default DelhiveryService;
