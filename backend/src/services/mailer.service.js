// services/mailer.service.js
// Single nodemailer transporter, reused across requests.
// Transporter creation is somewhat expensive — don't recreate per email.

import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: Number(config.SMTP_PORT) === 465, // true for 465, false for 587/25
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
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
    from: config.SMTP_FROM,
    to: toEmail,
    subject: "Your Smart Trolly Receipt",
    text: `Hi ${username || "there"},\n\nThanks for shopping with Smart Trolly 2.0. Your total was Rs. ${totalAmount}. Your receipt is attached.\n\n— Smart Trolly Team`,
    attachments: [
      {
        filename: "receipt.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}