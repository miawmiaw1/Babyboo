// src/pages/api/products/[id].json.ts
import type { APIRoute } from 'astro';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import type { SendOrderParams } from '../../../../FrontendRequests/Requests-Api/Email';

dotenv.config();

// Read a single product by ID
export const POST: APIRoute = async ({ request }) => {
  const { email, pdfbase64, Filename }: SendOrderParams = await request.json();
  const subject = `${process.env.STORENAME} - Ordrebekræftelse`;
  const text = `Dette er en ordre bekræftelsesemail fra: ${process.env.STORENAME} \n\n\n Din ordrebekræftelse er vedhæftet på denne email \n\n\n Du får en tracking nummer snarest - Hold øje med din indbakke`;

  // Create a transporter using your SMTP server
  const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTPHOST,
    port: Number(import.meta.env.SMTPPORT),
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: import.meta.env.SMTPEMAIL, // Replace with your email address
      pass: import.meta.env.SMTPPASSWORD, // Replace with your email password
    },
  });

  try {
    // Decode the Base64 content into a Buffer
    const pdfBuffer = Buffer.from(pdfbase64, 'base64');

    // Set up the email options
    const mailOptions = {
      from: process.env.SMTPEMAIL as string, // Sender's email address
      to: email,                             // Recipient's email address
      subject: subject,                      // Email subject
      text: text,                            // Email content
      attachments: [
        {
          content: pdfBuffer,               // Raw binary data
          filename: Filename,               // Desired filename for the attachment
          contentType: 'application/pdf',   // MIME type
          disposition: 'attachment',        // Attachment disposition
        },
      ],
    };

    // Send the email with attachment
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: 'Email sent' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return new Response(
      JSON.stringify({ message: 'Failed to send email', error: errorMessage }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
