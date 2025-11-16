import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { orderId } = params;
    
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'custom';

    console.log('📄 Invoice request for order:', orderId, 'source:', source);

    await connectDB();

    const order = await Order.findOne({ orderId });

    if (!order) {
      console.log('❌ Order not found:', orderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('✅ Order found:', order.orderId);

    // Option 1: Get invoice from Shiprocket if available
    if (source === 'shiprocket' && order.shiprocketOrderId) {
      try {
        console.log('🔍 Fetching invoice from Shiprocket...');
        const token = await shiprocketService.getToken();
        
        const invoiceResponse = await fetch(
          `https://apiv2.shiprocket.in/v1/external/orders/print/invoice`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ids: [order.shiprocketOrderId]
            })
          }
        );

        if (invoiceResponse.ok) {
          const invoiceData = await invoiceResponse.json();
          
          if (invoiceData.invoice_url) {
            console.log('✅ Shiprocket invoice URL:', invoiceData.invoice_url);
            return NextResponse.json({
              success: true,
              invoiceUrl: invoiceData.invoice_url,
              source: 'shiprocket'
            });
          }
        }
      } catch (error) {
        console.error('⚠️ Shiprocket invoice fetch failed:', error);
      }
    }

    // Option 2: Generate custom PDF invoice
    console.log('📝 Generating custom PDF invoice...');
    const pdfBytes = await generateCustomInvoice(order);

    console.log('✅ PDF generated successfully');

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${order.orderId}.pdf"`
      }
    });

  } catch (error) {
    console.error('❌ Invoice generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate invoice',
      details: error.message
    }, { status: 500 });
  }
}

// Generate custom PDF invoice using pdf-lib (NOT pdfkit!)
async function generateCustomInvoice(order) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  
  const { width, height } = page.getSize();
  
  // Embed fonts (no external files needed!)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Colors
  const primaryColor = rgb(0.227, 0.365, 0.118); // #3a5d1e
  const lightGreen = rgb(0.941, 0.992, 0.957); // #f0fdf4
  const white = rgb(1, 1, 1);
  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);
  const greenText = rgb(0.086, 0.639, 0.290);
  
  let yPosition = height - 50;
  
  // ========== HEADER ==========
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: primaryColor
  });
  
  page.drawText('NATURE MEDICA', {
    x: 50,
    y: height - 50,
    size: 32,
    font: boldFont,
    color: white
  });
  
  page.drawText('Natural Wellness & Ayurvedic Products', {
    x: 50,
    y: height - 75,
    size: 12,
    font: regularFont,
    color: white
  });
  
  page.drawText('1st Floor, LHPS Building, Sector-7, Lucknow - 226022', {
    x: 50,
    y: height - 92,
    size: 10,
    font: regularFont,
    color: white
  });
  
  page.drawText('Phone: +91 8400043322 | Email: info@naturemedica.com', {
    x: 50,
    y: height - 108,
    size: 10,
    font: regularFont,
    color: white
  });
  
  // ========== INVOICE TITLE ==========
  yPosition = height - 150;
  
  page.drawText('INVOICE', {
    x: 50,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: black
  });
  
  yPosition -= 30;
  
  // ========== INVOICE DETAILS ==========
  page.drawText(`Invoice Number: ${order.orderId}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: gray
  });
  
  yPosition -= 18;
  
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  page.drawText(`Order Date: ${orderDate}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: gray
  });
  
  yPosition -= 18;
  
  page.drawText(`Payment Mode: ${order.paymentMode === 'online' ? 'Online Payment' : 'Cash on Delivery'}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: gray
  });
  
  yPosition -= 40;
  
  // ========== BILLING BOX ==========
  page.drawRectangle({
    x: 50,
    y: yPosition - 100,
    width: 250,
    height: 120,
    color: lightGreen
  });
  
  page.drawText('BILL TO:', {
    x: 60,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: black
  });
  
  yPosition -= 20;
  
  page.drawText(order.shippingAddress.name, {
    x: 60,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: black
  });
  
  yPosition -= 15;
  
  const street = order.shippingAddress.street.substring(0, 40);
  page.drawText(street, {
    x: 60,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: black
  });
  
  yPosition -= 15;
  
  page.drawText(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, {
    x: 60,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: black
  });
  
  yPosition -= 15;
  
  page.drawText(`PIN: ${order.shippingAddress.pincode}`, {
    x: 60,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: black
  });
  
  yPosition -= 15;
  
  page.drawText(`Phone: ${order.shippingAddress.phone}`, {
    x: 60,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: black
  });
  
  // ========== SHIPPING BOX (if tracking available) ==========
  if (order.trackingId) {
    yPosition = height - 250;
    
    page.drawRectangle({
      x: 320,
      y: yPosition - 100,
      width: 225,
      height: 120,
      color: lightGreen
    });
    
    page.drawText('SHIPPING DETAILS:', {
      x: 330,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: black
    });
    
    yPosition -= 20;
    
    page.drawText(`Tracking: ${order.trackingId.substring(0, 20)}`, {
      x: 330,
      y: yPosition,
      size: 9,
      font: regularFont,
      color: black
    });
    
    yPosition -= 15;
    
    page.drawText(`Courier: ${order.courierName || 'Processing'}`, {
      x: 330,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: black
    });
    
    yPosition -= 15;
    
    page.drawText(`Status: ${order.orderStatus}`, {
      x: 330,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: black
    });
  }
  
  // ========== ITEMS TABLE ==========
  yPosition = height - 400;
  
  // Table header
  page.drawRectangle({
    x: 50,
    y: yPosition - 5,
    width: 495,
    height: 25,
    color: primaryColor
  });
  
  page.drawText('ITEM', {
    x: 60,
    y: yPosition + 3,
    size: 10,
    font: boldFont,
    color: white
  });
  
  page.drawText('QTY', {
    x: 330,
    y: yPosition + 3,
    size: 10,
    font: boldFont,
    color: white
  });
  
  page.drawText('PRICE', {
    x: 400,
    y: yPosition + 3,
    size: 10,
    font: boldFont,
    color: white
  });
  
  page.drawText('TOTAL', {
    x: 490,
    y: yPosition + 3,
    size: 10,
    font: boldFont,
    color: white
  });
  
  yPosition -= 30;
  
  // Table rows
  order.items.forEach((item, index) => {
    const bgColor = index % 2 === 0 ? white : rgb(0.98, 0.98, 0.98);
    
    page.drawRectangle({
      x: 50,
      y: yPosition - 5,
      width: 495,
      height: 25,
      color: bgColor
    });
    
    const itemTitle = item.title.length > 35 ? item.title.substring(0, 32) + '...' : item.title;
    
    page.drawText(itemTitle, {
      x: 60,
      y: yPosition + 3,
      size: 9,
      font: regularFont,
      color: black
    });
    
    page.drawText(item.quantity.toString(), {
      x: 340,
      y: yPosition + 3,
      size: 9,
      font: regularFont,
      color: black
    });
    
    page.drawText(`Rs ${item.price}`, {
      x: 400,
      y: yPosition + 3,
      size: 9,
      font: regularFont,
      color: black
    });
    
    page.drawText(`Rs ${item.price * item.quantity}`, {
      x: 485,
      y: yPosition + 3,
      size: 9,
      font: regularFont,
      color: black
    });
    
    yPosition -= 25;
  });
  
  // ========== TOTALS ==========
  yPosition -= 20;
  
  page.drawText('Subtotal:', {
    x: 400,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: gray
  });
  
  page.drawText(`Rs ${order.totalPrice}`, {
    x: 490,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: black
  });
  
  if (order.discount > 0) {
    yPosition -= 20;
    
    page.drawText('Discount:', {
      x: 400,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: greenText
    });
    
    page.drawText(`-Rs ${order.discount}`, {
      x: 490,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: greenText
    });
  }
  
  yPosition -= 20;
  
  page.drawText('Delivery:', {
    x: 400,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: gray
  });
  
  if (order.deliveryCharge > 0) {
    page.drawText(`Rs ${order.deliveryCharge}`, {
      x: 490,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: black
    });
  } else {
    page.drawText('FREE', {
      x: 505,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: greenText
    });
  }
  
  // Total box
  yPosition -= 30;
  
  page.drawRectangle({
    x: 390,
    y: yPosition - 5,
    width: 155,
    height: 30,
    color: primaryColor
  });
  
  page.drawText('TOTAL:', {
    x: 400,
    y: yPosition + 8,
    size: 12,
    font: boldFont,
    color: white
  });
  
  page.drawText(`Rs ${order.finalPrice}`, {
    x: 480,
    y: yPosition + 8,
    size: 14,
    font: boldFont,
    color: white
  });
  
  // ========== FOOTER ==========
  page.drawText('Thank you for shopping with Nature Medica!', {
    x: 150,
    y: 80,
    size: 8,
    font: regularFont,
    color: gray
  });
  
  page.drawText('For queries: +91 8400043322 or info@naturemedica.com', {
    x: 130,
    y: 65,
    size: 8,
    font: regularFont,
    color: gray
  });
  
  page.drawText('This is a computer-generated invoice.', {
    x: 175,
    y: 50,
    size: 8,
    font: regularFont,
    color: gray
  });
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
