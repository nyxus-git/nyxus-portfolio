import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const recipient = process.env.RECIPIENT_EMAIL;

    if (!user || !pass || !recipient) {
      console.error("Missing email credentials in environment variables.");
      return NextResponse.json({ message: 'Server is not configured for sending emails.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: user,
      to: recipient,
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Your message has been sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ message: 'Failed to send your message. Please try again later.' }, { status: 500 });
  }
}