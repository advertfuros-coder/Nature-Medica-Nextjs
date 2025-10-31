import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendShipmentCreatedEmail(order) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3a5d1e, #5a7f3d); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .tracking-box { background: #f8f9fa; border: 2px solid #3a5d1e; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #3a5d1e; font-family: monospace; }
        .button { display: inline-block; background: #3a5d1e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🚚 Your Order is Shipped!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order #${order.orderId}</p>
        </div>
        <div class="content">
          <h2 style="color: #333; margin-top: 0;">Hello ${order.shippingAddress.name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Great news! Your order has been shipped and is on its way to you.
          </p>
          
          <div class="tracking-box">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Tracking Number</p>
            <div class="tracking-number">${order.trackingId}</div>
            <p style="margin: 15px 0 0 0; color: #999; font-size: 12px;">
              Courier: ${order.courierName}
            </p>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/track/${order.trackingId}" class="button">
              Track Your Shipment
            </a>
          </div>

          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            <strong>Delivery Address:</strong><br/>
            ${order.shippingAddress.street}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} NatureMedica. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: order.userEmail,
      subject: `Your Order #${order.orderId} is Shipped! 🚚`,
      html
    });

    console.log('✅ Shipment notification sent to:', order.userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send shipment email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendDeliveredEmail(order) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .success-icon { font-size: 64px; text-align: center; margin: 20px 0; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎉 Order Delivered!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order #${order.orderId}</p>
        </div>
        <div class="content">
          <div class="success-icon">✅</div>
          <h2 style="color: #333; text-align: center; margin-top: 0;">Delivered Successfully!</h2>
          <p style="color: #666; line-height: 1.6; text-align: center;">
            Your order has been delivered. We hope you love your purchase!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.orderId}" class="button">
              View Order Details
            </a>
          </div>

          <p style="color: #666; line-height: 1.6;">
            If you have any concerns about your order, please don't hesitate to contact us.
          </p>

          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Thank you for shopping with NatureMedica! 🌿
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} NatureMedica. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: order.userEmail,
      subject: `Your Order #${order.orderId} is Delivered! 🎉`,
      html
    });

    console.log('✅ Delivery notification sent to:', order.userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send delivery email:', error);
    return { success: false, error: error.message };
  }
}
