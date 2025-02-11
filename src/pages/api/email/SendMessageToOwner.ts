// src/pages/api/products/[id].json.ts
import type { APIRoute } from 'astro';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Read a single product by ID
export const POST: APIRoute = async ({ request }) => {
  const { email, text, subject } = await request.json();

  // Create a transporter using your SMTP server
  const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTPHOST,
    port: import.meta.env.SMTPPORT,
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: import.meta.env.SMTPEMAIL, // Replace with your email address
      pass: import.meta.env.SMTPPASSWORD,     // Replace with your email password
    },
  });

  try {
    // Set up the email options
    const mailOptions = {
      from: process.env.SMTPEMAIL as string, // Sender's email address
      to: process.env.SMTPEMAIL as string, // Recipient's email address
      subject: subject,                     // Subject of the email
      text: `${text} \n\n Denne email er sendt fra: ${email}`, // Email content
    };

    // Send the email
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
