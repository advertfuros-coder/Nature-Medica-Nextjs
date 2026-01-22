import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send OTP email
export async function sendOTPEmail(email, otp, type = "verification") {
  const subject =
    type === "verification"
      ? "Verify Your Email - NatureMedica"
      : "Reset Your Password - NatureMedica";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3a5d1e, #5a7f3d); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .otp-box { background: #f8f9fa; border: 2px dashed #3a5d1e; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: bold; color: #3a5d1e; letter-spacing: 8px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 30px; background: #3a5d1e; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🌿 NatureMedica</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${subject}</p>
        </div>
        <div class="content">
          <h2 style="color: #333; margin-top: 0;">Hello!</h2>
          <p style="color: #666; line-height: 1.6;">
            ${
              type === "verification"
                ? "Thank you for signing up with NatureMedica. Please use the OTP below to verify your email address."
                : "We received a request to reset your password. Use the OTP below to proceed."
            }
          </p>
          
          <div class="otp-box">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 15px 0 0 0; color: #999; font-size: 12px;">Valid for 10 minutes</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you didn't request this, please ignore this email or contact our support team.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 13px; margin: 0;">
              <strong>Security tip:</strong> Never share your OTP with anyone. NatureMedica will never ask for your OTP.
            </p>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} NatureMedica. All rights reserved.</p>
          <p style="margin: 10px 0 0 0;">Natural Wellness Products</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// Send welcome email
export async function sendWelcomeEmail(name, email) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3a5d1e, #5a7f3d); color: white; padding: 40px; text-align: center; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; padding: 14px 32px; background: #3a5d1e; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">🎉 Welcome to NatureMedica!</h1>
        </div>
        <div class="content">
          <h2 style="color: #333;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            We're excited to have you join our community of wellness enthusiasts. Your account is now active and ready to use!
          </p>
          <p style="color: #666; line-height: 1.6;">
            Explore our range of premium Ayurvedic supplements and natural wellness products designed to help you live your healthiest life.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.NEXT_PUBLIC_SITE_URL
            }/products" class="button">Start Shopping</a>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h3 style="margin: 0 0 10px 0; color: #3a5d1e;">Why Choose NatureMedica?</h3>
            <ul style="color: #666; padding-left: 20px;">
              <li>100% Natural & Organic Products</li>
              <li>Lab-Tested for Quality & Purity</li>
              <li>Free Shipping on All Orders</li>
              <li>Easy Returns within 30 Days</li>
            </ul>
          </div>
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
      to: email,
      subject: "Welcome to NatureMedica! 🌿",
      html,
    });
  } catch (error) {
    console.error("Welcome email error:", error);
  }
}

// Send order notification email to admins
export async function sendOrderNotificationEmail(order, recipients) {
  if (!recipients || recipients.length === 0) return;

  const subject = `New Order Received - #${order.orderId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3a5d1e, #5a7f3d); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .order-details { background: #f8f9fa; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 10px; }
        .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { color: #666; font-size: 14px; }
        .value { color: #333; font-weight: bold; font-size: 14px; }
        .button { display: inline-block; padding: 12px 30px; background: #3a5d1e; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📦 New Order Alert!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order #${
            order.orderId
          }</p>
        </div>
        <div class="content">
          <h2 style="color: #333; margin-top: 0;">Hey Team!</h2>
          <p style="color: #666; line-height: 1.6;">
            A new order has just been placed. Here are the details:
          </p>
          
          <div class="order-details">
            <div class="detail-row">
              <span class="label">Customer Name</span>
              <span class="value">${order.shippingAddress?.name || order.userName || "N/A"}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Amount</span>
              <span class="value">₹${order.finalPrice}</span>
            </div>
            <div class="detail-row">
              <span class="label">Payment Method</span>
              <span class="value">${order.paymentMode ? order.paymentMode.toUpperCase() : "N/A"}</span>
            </div>
             <div class="detail-row">
              <span class="label">Date</span>
              <span class="value">${new Date(
                order.createdAt,
              ).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${
              order._id
            }" class="button">View Order Details</a>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0;">NatureMedica Admin Notification System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send to all recipients
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: recipients.join(", "), // Send to all recipients at once, or loop if privacy needed (BCC)
      subject,
      html,
    });
    console.log(`Order notification sent to: ${recipients.join(", ")}`);
    return { success: true };
  } catch (error) {
    console.error("Order notification email error:", error);
    return { success: false, error: error.message };
  }
}
// Send franchise inquiry notification email to admins
export async function sendFranchiseNotificationEmail(inquiry, recipients) {
  if (!recipients || recipients.length === 0) return;

  const subject = `New Franchise Inquiry - ${inquiry.name}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3a5d1e, #5a7f3d); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .details-box { background: #f8f9fa; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 10px; }
        .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { color: #666; font-size: 14px; flex: 1; }
        .value { color: #333; font-weight: bold; font-size: 14px; flex: 1; text-align: right; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🤝 New Franchise Inquiry!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Nature Medica Franchise Opportunity</p>
        </div>
        <div class="content">
          <h2 style="color: #333; margin-top: 0;">Business Lead Notification</h2>
          <p style="color: #666; line-height: 1.6;">
            A new franchise inquiry has been received. Here are the applicant's details:
          </p>
          
          <div class="details-box">
            <div class="detail-row">
              <span class="label">Name</span>
              <span class="value">${inquiry.name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email</span>
              <span class="value">${inquiry.email}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone</span>
              <span class="value">${inquiry.phone}</span>
            </div>
            <div class="detail-row">
              <span class="label">Location</span>
              <span class="value">${inquiry.city}, ${inquiry.state} - ${inquiry.pincode}</span>
            </div>
             <div class="detail-row">
              <span class="label">Investment Capacity</span>
              <span class="value">${inquiry.investmentCapacity}</span>
            </div>
            <div class="detail-row">
              <span class="label">Property Status</span>
              <span class="value">${inquiry.propertyStatus}</span>
            </div>
            <div class="detail-row">
              <span class="label">Shop Area</span>
              <span class="value">${inquiry.shopArea} sq. ft.</span>
            </div>
            <div class="detail-row">
              <span class="label">Profession</span>
              <span class="value">${inquiry.profession || "N/A"}</span>
            </div>
          </div>

          ${
            inquiry.message
              ? `
          <div style="margin-top: 20px;">
            <p style="color: #666; font-weight: bold; margin-bottom: 5px;">Applicant Message:</p>
            <p style="color: #333; font-style: italic; background: #fff9e6; padding: 15px; border-radius: 6px; border-left: 4px solid #ffcc00;">
              "${inquiry.message}"
            </p>
          </div>
          `
              : ""
          }
          
        </div>
        <div class="footer">
          <p style="margin: 0;">NatureMedica Franchise Management System</p>
          <p style="margin: 5px 0 0 0;">Received on: ${new Date().toLocaleString("en-IN")}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: recipients.join(", "),
      subject,
      html,
    });
    console.log(`Franchise notification sent to: ${recipients.join(", ")}`);
    return { success: true };
  } catch (error) {
    console.error("Franchise notification email error:", error);
    return { success: false, error: error.message };
  }
}
