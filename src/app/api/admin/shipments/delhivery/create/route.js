import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import delhiveryService from '@/lib/delhivery';

export async function POST(req) {
  try {
    await connectDB();
    const { orderId, weight } = await req.json();

    console.log('📦 Creating Delhivery shipment for order:', orderId);

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if already has waybill
    if (order.delhiveryWaybill) {
      return NextResponse.json({
        success: true,
        message: 'Delhivery shipment already exists',
        waybill: order.delhiveryWaybill,
        trackingUrl: `https://track.delhivery.com/track/package/${order.delhiveryWaybill}`,
        labelUrl: delhiveryService.generateLabelUrl(order.delhiveryWaybill)
      });
    }

    // Check serviceability
    try {
      const serviceCheck = await delhiveryService.checkPincodeServiceability(
        order.shippingAddress.pincode
      );

      if (!serviceCheck.delivery_codes || serviceCheck.delivery_codes.length === 0) {
        return NextResponse.json({
          error: `Delhivery doesn't service pincode: ${order.shippingAddress.pincode}`,
          suggestion: 'Try Shiprocket or Manual Entry instead'
        }, { status: 400 });
      }
    } catch (error) {
      console.warn('⚠️ Serviceability check failed, proceeding anyway:', error.message);
    }

    // Fetch waybill
    console.log('🔢 Fetching waybill...');
    const waybillResponse = await delhiveryService.fetchWaybill();
    
    if (!waybillResponse.waybill) {
      throw new Error('Failed to fetch waybill from Delhivery');
    }

    const waybill = waybillResponse.waybill;
    console.log('✅ Waybill obtained:', waybill);

    // Prepare shipment data
    const shipmentData = {
      shipments: [
        {
          name: order.shippingAddress.name,
          add: order.shippingAddress.street,
          city: order.shippingAddress.city,
          pin: order.shippingAddress.pincode,
          state: order.shippingAddress.state,
          country: 'India',
          phone: order.shippingAddress.phone,
          order: order.orderId,
          payment_mode: order.paymentMode === 'cod' ? 'COD' : 'Prepaid',
          return_pin: process.env.DELHIVERY_RETURN_PINCODE || '226001',
          return_city: process.env.DELHIVERY_RETURN_CITY || 'Lucknow',
          return_phone: process.env.DELHIVERY_RETURN_PHONE || order.shippingAddress.phone,
          return_add: process.env.DELHIVERY_RETURN_ADDRESS || order.shippingAddress.street,
          return_state: process.env.DELHIVERY_RETURN_STATE || 'Uttar Pradesh',
          return_country: 'India',
          products_desc: order.items.map(item => item.title).join(', '),
          hsn_code: '',
          cod_amount: order.paymentMode === 'cod' ? order.finalPrice.toString() : '0',
          order_date: new Date(order.createdAt).toISOString().split('T')[0],
          total_amount: order.finalPrice.toString(),
          seller_add: process.env.DELHIVERY_SELLER_ADDRESS || 'Lucknow, UP',
          seller_name: process.env.DELHIVERY_SELLER_NAME || 'Nature Medica',
          seller_inv: order.orderId,
          quantity: order.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
          waybill: waybill,
          shipment_width: '10',
          shipment_height: '10',
          weight: (weight || 0.5).toString(),
          seller_gst_tin: process.env.DELHIVERY_GST || '',
          shipping_mode: 'Surface',
          address_type: order.shippingAddress.type || 'home'
        }
      ],
      pickup_location: {
        name: process.env.DELHIVERY_PICKUP_LOCATION || 'Primary'
      }
    };

    console.log('📤 Creating shipment with waybill:', waybill);

    // Create shipment
    const createResponse = await delhiveryService.createShipment(shipmentData);

    console.log('✅ Shipment created successfully');

    // Update order in database
    await Order.findByIdAndUpdate(order._id, {
      delhiveryWaybill: waybill,
      trackingId: waybill,
      courierName: 'Delhivery',
      orderStatus: 'Shipped',
      $push: {
        statusHistory: {
          status: 'Shipped',
          updatedAt: new Date(),
          note: `Delhivery shipment created - Waybill: ${waybill}`
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: '✅ Delhivery shipment created successfully!',
      waybill: waybill,
      trackingUrl: `https://track.delhivery.com/track/package/${waybill}`,
      labelUrl: delhiveryService.generateLabelUrl(waybill),
      invoiceUrl: delhiveryService.generateInvoiceUrl(waybill)
    });

  } catch (error) {
    console.error('❌ Delhivery shipment creation error:', error);
    return NextResponse.json({
      error: 'Failed to create Delhivery shipment',
      details: error.message,
      suggestion: 'Please try Shiprocket or Manual Entry instead'
    }, { status: 500 });
  }
}
