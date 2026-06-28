// services/mailer.service.js
import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: false,        // false for port 587 (STARTTLS), true for 465 (SSL)
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS, // must be Gmail App Password, NOT account password
  },
  tls: {
    rejectUnauthorized: false, // prevents cert errors in dev environment
  },
});

/**
 * @param {string} toEmail
 * @param {string} username
 * @param {Buffer} pdfBuffer
 * @param {number} totalAmount
 */
export async function sendBillEmail({ toEmail, username, pdfBuffer, totalAmount }) {
  await transporter.sendMail({
    from: `"Smart Trolly 2.0" <${config.SMTP_FROM}>`,
    to: toEmail,
    subject: "Your Smart Trolly Receipt",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #10b981;">Smart Trolly 2.0</h2>
        <p>Hi <strong>${username || "there"}</strong>,</p>
        <p>Thanks for shopping with Smart Trolly 2.0.</p>
        <p>Your total was <strong>₹${totalAmount}</strong>.</p>
        <p>Your receipt is attached as a PDF.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
        <p style="color:#94a3b8;font-size:12px;">Smart Trolly 2.0 — AI-Powered Checkout</p>
      </div>
    `,
    attachments: [
      {
        filename: `receipt_${Date.now()}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}