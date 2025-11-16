import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import shiprocketService from '@/lib/shiprocket';
import ReactPDF, { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Poppins font
Font.register({
  family: 'Poppins',
  fonts: [
    { src: `${process.cwd()}/public/fonts/Poppins-Regular.ttf`, fontWeight: 400 },
    { src: `${process.cwd()}/public/fonts/Poppins-SemiBold.ttf`, fontWeight: 600 },
    { src: `${process.cwd()}/public/fonts/Poppins-Bold.ttf`, fontWeight: 700 },
  ]
});

// Optimized compact styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Poppins',
    padding: 0,
  },
  // Compact Header
  header: {
    backgroundColor: '#3a5d1e',
    padding: 20,
    marginBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 4,
  },
  companyTagline: {
    fontSize: 9,
    color: '#e8f5e9',
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 7,
    color: '#c8e6c9',
    lineHeight: 1.3,
  },
  // Invoice details section
  invoiceSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceLeft: {
    flex: 1,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  invoiceDetail: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 3,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    fontSize: 7,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  // Compact Address boxes
  addressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  addressBox: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #d4f4dd',
  },
  addressTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: '#3a5d1e',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  addressText: {
    fontSize: 7,
    color: '#2d2d2d',
    marginBottom: 2.5,
    lineHeight: 1.3,
  },
  // Compact Table
  table: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3a5d1e',
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 7,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #e8e8e8',
    padding: '6px 8px',
    backgroundColor: '#ffffff',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #e8e8e8',
    padding: '6px 8px',
    backgroundColor: '#fafafa',
  },
  tableCell: {
    fontSize: 7,
    color: '#333333',
    lineHeight: 1.3,
  },
  tableCellBold: {
    fontSize: 7,
    fontWeight: 600,
    color: '#1a1a1a',
    lineHeight: 1.3,
  },
  itemVariant: {
    fontSize: 6,
    color: '#666666',
    marginTop: 2,
  },
  // Compact Totals section
  totalsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 8,
    color: '#666666',
    width: 120,
    textAlign: 'right',
    marginRight: 15,
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 600,
    color: '#1a1a1a',
    width: 80,
    textAlign: 'right',
  },
  discountValue: {
    fontSize: 8,
    fontWeight: 600,
    color: '#16a34a',
    width: 80,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#3a5d1e',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
    width: 120,
    textAlign: 'right',
    marginRight: 15,
  },
  grandTotalValue: {
    fontSize: 13,
    fontWeight: 700,
    color: '#ffffff',
    width: 80,
    textAlign: 'right',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    borderTop: '1px solid #e8e8e8',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 6,
    color: '#999999',
    marginBottom: 3,
  },
  footerBold: {
    fontSize: 7,
    fontWeight: 600,
    color: '#3a5d1e',
    marginBottom: 5,
  },
});

// Truncate long text helper
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
};

// Invoice PDF Document Component
const InvoiceDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Compact Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>NATURE MEDICA</Text>
        <Text style={styles.companyTagline}>Natural Wellness & Ayurvedic Products</Text>
        <Text style={styles.companyAddress}>
          1st Floor, LHPS Building, Sector-7, Kamla Nehru Nagar, Lucknow - 226022 | +91 8400043322 | info@naturemedica.com
        </Text>
      </View>

      {/* Compact Invoice Details */}
      <View style={styles.invoiceSection}>
        <View style={styles.invoiceLeft}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceDetail}>Invoice: {order.orderId}</Text>
          <Text style={styles.invoiceDetail}>
            Date: {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
          <Text style={styles.invoiceDetail}>
            Payment: {order.paymentMode === 'online' ? 'Online' : 'COD'}
          </Text>
          {order.paymentStatus === 'completed' && (
            <View style={styles.statusBadge}>
              <Text>✓ PAID</Text>
            </View>
          )}
        </View>
      </View>

      {/* Compact Address Boxes */}
      <View style={styles.addressContainer}>
        {/* Billing Address */}
        <View style={styles.addressBox}>
          <Text style={styles.addressTitle}>Bill To</Text>
          <Text style={styles.addressText}>{truncateText(order.shippingAddress.name, 25)}</Text>
          <Text style={styles.addressText}>{truncateText(order.shippingAddress.street, 35)}</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </Text>
          <Text style={styles.addressText}>PIN: {order.shippingAddress.pincode}</Text>
          <Text style={styles.addressText}>Ph: {order.shippingAddress.phone}</Text>
        </View>

        {/* Shipping Details */}
        {order.trackingId && (
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>Shipping</Text>
            <Text style={styles.addressText}>AWB: {truncateText(order.trackingId, 20)}</Text>
            <Text style={styles.addressText}>Courier: {truncateText(order.courierName || 'Processing', 20)}</Text>
            <Text style={styles.addressText}>Status: {order.orderStatus}</Text>
          </View>
        )}
      </View>

      {/* Compact Items Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: '50%' }]}>Item</Text>
          <Text style={[styles.tableHeaderText, { width: '12%', textAlign: 'center' }]}>Qty</Text>
          <Text style={[styles.tableHeaderText, { width: '19%', textAlign: 'right' }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { width: '19%', textAlign: 'right' }]}>Total</Text>
        </View>

        {/* Table Rows - Compact */}
        {order.items.map((item, index) => (
          <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <View style={{ width: '50%' }}>
              <Text style={styles.tableCellBold}>
                {truncateText(item.title, 45)}
              </Text>
              {item.variant && (
                <Text style={styles.itemVariant}>{truncateText(item.variant, 40)}</Text>
              )}
            </View>
            <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCell, { width: '19%', textAlign: 'right' }]}>
              ₹{item.price.toLocaleString('en-IN')}
            </Text>
            <Text style={[styles.tableCellBold, { width: '19%', textAlign: 'right' }]}>
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </Text>
          </View>
        ))}
      </View>

      {/* Compact Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>₹{order.totalPrice.toLocaleString('en-IN')}</Text>
        </View>

        {order.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={styles.discountValue}>-₹{order.discount.toLocaleString('en-IN')}</Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Delivery:</Text>
          <Text style={order.deliveryCharge > 0 ? styles.totalValue : styles.discountValue}>
            {order.deliveryCharge > 0 ? `₹${order.deliveryCharge.toLocaleString('en-IN')}` : 'FREE'}
          </Text>
        </View>

        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>TOTAL</Text>
          <Text style={styles.grandTotalValue}>₹{order.finalPrice.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Compact Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerBold}>Thank you for shopping with Nature Medica!</Text>
        <Text style={styles.footerText}>
          For queries: +91 8400043322 or info@naturemedica.com
        </Text>
        <Text style={styles.footerText}>
          This is a computer-generated invoice and does not require a signature.
        </Text>
      </View>
    </Page>
  </Document>
);

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
    console.log('📝 Generating compact PDF invoice...');
    
    const pdfStream = await ReactPDF.renderToStream(<InvoiceDocument order={order} />);
    const chunks = [];
    
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    
    const pdfBuffer = Buffer.concat(chunks);

    console.log('✅ PDF generated successfully');

    return new NextResponse(pdfBuffer, {
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
