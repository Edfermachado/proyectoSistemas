import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, supportEmail } = await req.json();

    // In a real production system, configure these via environment variables:
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal_password',
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: supportEmail,
      subject: `UniEvents Contacto: ${subject}`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
    };

    // If no real SMTP config is provided, we just log and pretend it sent
    if (!process.env.SMTP_HOST) {
      console.log("Mock Email Sent:");
      console.log(mailOptions);
      return NextResponse.json({ success: true, message: 'Mock email sent successfully' });
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
