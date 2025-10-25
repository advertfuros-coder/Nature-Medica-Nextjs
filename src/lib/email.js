import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, name, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
  
  const mailOptions = {
    from: `"NatureMedica" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Email - NatureMedica',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Welcome to NatureMedica!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with NatureMedica. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>NatureMedica Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendOrderConfirmation(email, name, orderId, orderDetails) {
  const mailOptions = {
    from: `"NatureMedica" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Order Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Your order <strong>${orderId}</strong> has been confirmed and is being processed.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Summary</h3>
          ${orderDetails.items.map(item => `
            <div style="margin-bottom: 10px;">
              <strong>${item.title}</strong> x ${item.quantity}<br>
              <span style="color: #666;">₹${item.price}</span>
            </div>
          `).join('')}
          <hr style="border: none; border-top: 1px solid #d1d5db;">
          <div style="font-size: 18px; font-weight: bold;">
            Total: ₹${orderDetails.finalPrice}
          </div>
        </div>
        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>NatureMedica Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email, name, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"NatureMedica" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your Password - NatureMedica',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Reset Your Password</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>NatureMedica Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    return { success: true, message: 'Email server is ready' };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return { success: false, error: error.message };
  }
}
