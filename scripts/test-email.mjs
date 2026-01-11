import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testEmail() {
  console.log("📧 Testing SMTP Configuration...");

  console.log("Settings:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    from: process.env.SMTP_FROM_EMAIL,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    debug: true, // Enable debug output
    logger: true, // Log to console
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // verify connection configuration
    console.log("🔄 Verifying connection...");
    await transporter.verify();
    console.log("✅ Server connection verified");

    console.log("📤 Sending test email...");
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: "harshurao058@gmail.com", // Hardcoded to the user's reported email for testing
      subject: "Test Email from Nature Medica Debugger",
      text: "If you receive this, your SMTP settings are working correctly!",
      html: "<b>If you receive this, your SMTP settings are working correctly!</b>",
    });

    console.log("✅ Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Error occurred:", error);
  }
}

testEmail();
