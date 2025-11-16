import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';

export async function GET(req, { params }) {
  try {
    const { awb } = params;

    console.log('🔍 Tracking request for AWB:', awb);

    if (!awb) {
      return NextResponse.json({ 
        error: 'AWB number required' 
      }, { status: 400 });
    }

    await connectDB();

    // STEP 1: Try to find order in database first
    let order = await Order.findOne({
      $or: [
        { trackingId: awb },
        { orderId: awb },
        { shiprocketOrderId: awb }
      ]
    });

    console.log('📦 Order found in DB:', order ? order.orderId : 'Not found');

    // STEP 2: If not found in DB, try Shiprocket API directly
    if (!order) {
      console.log('🔍 Not in DB, checking Shiprocket API...');
      
      try {
        const token = await shiprocketService.getToken();
        
        // Track via Shiprocket API
        const response = await fetch(
          `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const shiprocketData = await response.json();
        console.log('📡 Shiprocket response:', shiprocketData);

        if (response.ok && shiprocketData.tracking_data) {
          const trackData = shiprocketData.tracking_data;
          
          // Try to find order by Shiprocket order ID
          if (trackData.shipment_track?.[0]?.order_id) {
            const shiprocketOrderId = trackData.shipment_track[0].order_id;
            order = await Order.findOne({ 
              orderId: shiprocketOrderId 
            });
            
            // Update order with tracking info if found
            if (order) {
              await Order.findByIdAndUpdate(order._id, {
                trackingId: awb,
                courierName: trackData.shipment_track[0]?.courier_name
              });
            }
          }

          // Return Shiprocket tracking data even if order not in DB
          return NextResponse.json({
            success: true,
            tracking: {
              provider: 'Shiprocket',
              awb: awb,
              current_status: trackData.shipment_status || trackData.shipment_track?.[0]?.current_status || 'In Transit',
              courier_name: trackData.shipment_track?.[0]?.courier_name || 'Courier Service',
              edd: trackData.edd || trackData.shipment_track?.[0]?.edd || null,
              activities: (trackData.shipment_track_activities || []).map(activity => ({
                activity: activity.activity || activity['sr-status-label'],
                date: activity.date,
                location: activity.location || activity['sr-scan-location'] || 'Unknown',
                status_code: activity['sr-status']
              }))
            },
            order: order ? {
              orderId: order.orderId,
              orderDate: order.createdAt,
              customerName: order.shippingAddress.name,
              status: order.orderStatus,
              items: order.items.map(item => ({
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                image: item.image
              })),
              totalAmount: order.finalPrice,
              shippingAddress: {
                street: order.shippingAddress.street,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                pincode: order.shippingAddress.pincode
              }
            } : {
              orderId: trackData.shipment_track?.[0]?.order_id || awb,
              orderDate: new Date(),
              customerName: 'Customer',
              status: trackData.shipment_status || 'In Transit',
              items: [],
              totalAmount: 0
            }
          });
        }
      } catch (shiprocketError) {
        console.error('⚠️ Shiprocket API error:', shiprocketError);
        // Continue to return 404 if Shiprocket also fails
      }
    }

    // STEP 3: If found in database, return order data
    if (order) {
      const trackingData = {
        provider: order.courierName || 'Nature Medica',
        awb: awb,
        current_status: order.orderStatus,
        courier_name: order.courierName || 'Processing',
        edd: null,
        activities: (order.statusHistory || []).map(status => ({
          activity: status.status,
          date: status.updatedAt,
          location: status.note || 'Nature Medica Warehouse',
          status_code: status.status
        })).reverse()
      };

      return NextResponse.json({
        success: true,
        tracking: trackingData,
        order: {
          orderId: order.orderId,
          orderDate: order.createdAt,
          customerName: order.shippingAddress.name,
          customerEmail: order.userEmail,
          customerPhone: order.shippingAddress.phone,
          status: order.orderStatus,
          items: order.items.map(item => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            variant: item.variant || ''
          })),
          totalAmount: order.finalPrice,
          shippingAddress: {
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            pincode: order.shippingAddress.pincode
          }
        }
      });
    }

    // STEP 4: Not found anywhere
    return NextResponse.json({
      error: 'Order not found',
      message: 'No order found with this AWB number. Please verify the AWB and try again.'
    }, { status: 404 });

  } catch (error) {
    console.error('❌ Track shipment error:', error);
    return NextResponse.json({
      error: 'Failed to track shipment',
      details: error.message
    }, { status: 500 });
  }
}
