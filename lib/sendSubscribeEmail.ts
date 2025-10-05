// lib/sendSubscribeEmail.ts
"use server"; // ensures this runs only on the server
import nodemailer from "nodemailer";

interface EmailProps {
  to: string;
  subject: string;
  html: string;
}

export const sendSubscribeEmail = async ({ to, subject, html }: EmailProps) => {
  if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
    throw new Error("Email credentials are missing");
  }

  // Use SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com", // or Gmail: smtp.gmail.com
    port: 465, // 465 for SSL, 587 for TLS
    secure: true, // SSL
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `Elvyn Store <${process.env.ZOHO_EMAIL}>`,
    to,
    subject,
    html,
  });
};
