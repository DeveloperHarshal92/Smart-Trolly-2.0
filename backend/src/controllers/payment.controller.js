// controllers/payment.controller.js

import { generateBill } from "../services/billing.service.js";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "../services/payment.service.js";
import { generateBillPDF } from "../services/pdf.service.js";
import { sendBillEmail } from "../services/mailer.service.js";
import userModel from "../models/user.model.js";

// In-memory store for resend — keyed by userId string.
// Production upgrade: persist in MongoDB Payment collection.
const lastReceiptStore = new Map();

// ── Preview ────────────────────────────────────────────────────────────────

export const previewBill = async (req, res) => {
  try {
    const { items } = req.body;
    const bill = generateBill(items);
    return res.status(200).json({ success: true, bill });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ── Create Razorpay order ──────────────────────────────────────────────────

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const bill = generateBill(items);
    const order = await createRazorpayOrder(bill.totalAmount, bill.currency);

    return res.status(200).json({
      success: true,
      message: "Order created",
      order,
      bill,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Could not create order",
    });
  }
};

// ── Verify payment → generate PDF → email → store for resend ──────────────

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items } =
    req.body;

  try {
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const bill = generateBill(items);
    const user = await userModel.findById(req.user.id);

    const pdfBuffer = await generateBillPDF(bill, {
      username: user?.username,
      email: user?.email,
    });

    // Store for /resend-receipt — MUST happen before fire-and-forget email
    lastReceiptStore.set(String(req.user.id), {
      pdfBuffer,
      totalAmount: bill.totalAmount,
    });

    // Fire-and-forget — don't fail the payment response if email fails
    if (user?.email) {
      sendBillEmail({
        toEmail: user.email,
        username: user.username,
        pdfBuffer,
        totalAmount: bill.totalAmount,
      }).catch((err) =>
        console.error("[mailer] auto-send failed:", err.message),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      bill,
      pdfBase64: pdfBuffer.toString("base64"),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification error",
    });
  }
};

// ── Resend receipt ─────────────────────────────────────────────────────────

export const resendReceipt = async (req, res) => {
  try {
    const stored = lastReceiptStore.get(String(req.user.id));

    if (!stored) {
      return res.status(404).json({
        success: false,
        message: "No recent receipt found. Please complete a payment first.",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user?.email) {
      return res.status(400).json({
        success: false,
        message: "No email address on this account.",
      });
    }

    await sendBillEmail({
      toEmail: user.email,
      username: user.username,
      pdfBuffer: stored.pdfBuffer,
      totalAmount: stored.totalAmount,
    });

    return res.status(200).json({ success: true, message: "Receipt sent" });
  } catch (error) {
    console.error("[resend] error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send receipt. Check SMTP credentials.",
    });
  }
};
