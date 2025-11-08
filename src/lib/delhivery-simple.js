class DelhiverySimpleService {
  constructor() {
    this.token = process.env.DELHIVERY_API_TOKEN;
    this.baseURL = 'https://track.delhivery.com/api';
  }

  // Create shipment (main function you need)
  async createShipment(orderData) {
    const {
      orderId,
      customerName,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      items,
      paymentMode,
      totalAmount,
      codAmount,
      weight
    } = orderData;

    const shipmentPayload = {
      shipments: [{
        name: customerName,
        add: address,
        city: city,
        pin: pincode,
        state: state,
        country: 'India',
        phone: phone,
        order: orderId,
        payment_mode: paymentMode === 'cod' ? 'COD' : 'Prepaid',
        return_pin: process.env.DELHIVERY_RETURN_PINCODE || '226001',
        return_city: process.env.DELHIVERY_RETURN_CITY || 'Lucknow',
        return_phone: process.env.DELHIVERY_RETURN_PHONE || phone,
        return_add: process.env.DELHIVERY_RETURN_ADDRESS || address,
        return_state: process.env.DELHIVERY_RETURN_STATE || 'Uttar Pradesh',
        return_country: 'India',
        products_desc: items.map(i => i.title).join(', '),
        cod_amount: codAmount.toString(),
        order_date: new Date().toISOString().split('T')[0],
        total_amount: totalAmount.toString(),
        seller_add: process.env.DELHIVERY_SELLER_ADDRESS || 'Lucknow',
        seller_name: process.env.DELHIVERY_SELLER_NAME || 'Nature Medica',
        seller_inv: orderId,
        quantity: items.reduce((sum, i) => sum + i.quantity, 0).toString(),
        waybill: '',
        shipment_width: '10',
        shipment_height: '10',
        weight: weight.toString(),
        seller_gst_tin: process.env.DELHIVERY_GST || '',
        shipping_mode: 'Surface',
        address_type: 'home'
      }],
      pickup_location: {
        name: 'Primary'
      }
    };

    try {
      const formData = new URLSearchParams();
      formData.append('format', 'json');
      formData.append('data', JSON.stringify(shipmentPayload));

      const response = await fetch(`${this.baseURL}/cmu/create.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Token ${this.token}`
        },
        body: formData.toString()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create shipment');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Track shipment
  async trackShipment(waybill) {
    const response = await fetch(
      `${this.baseURL}/v1/packages/json/?waybill=${waybill}`,
      {
        headers: {
          'Authorization': `Token ${this.token}`
        }
      }
    );

    return await response.json();
  }

  // Generate label URL
  generateLabelUrl(waybill) {
    return `${this.baseURL}/p/packing_slip?wbns=${waybill}&pdf=true`;
  }
}

const delhiverySimpleService = new DelhiverySimpleService();
export default delhiverySimpleService;
