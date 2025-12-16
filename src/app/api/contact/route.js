import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, phone, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Save to database
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: "new",
      createdAt: new Date(),
    });

    // Send email notification to admin
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL || "naturemedica09@gmail.com",
        subject: `New Contact Message: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><small>Received: ${new Date().toLocaleString("en-IN")}</small></p>
        `,
      });

      // Send confirmation email to user
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "We received your message - Nature Medica",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3a5d1e;">Thank you for contacting us!</h2>
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Message:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p>${message}</p>
            </div>
            <p>Best regards,<br>Nature Medica Team</p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      messageId: contactMessage._id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

// Get all contact messages (Admin only)
export async function GET(req) {
  try {
    // Add admin authentication here
    await connectDB();

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
