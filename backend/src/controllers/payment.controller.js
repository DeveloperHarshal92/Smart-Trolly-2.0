// controllers/payment.controller.js
// Wires together: billing.service -> payment.service -> pdf.service -> mailer.service
// req.user is set by the protect middleware (JWT cookie).

import { generateBill } from "../services/billing.service.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/payment.service.js";
import { generateBillPDF } from "../services/pdf.service.js";
import { sendBillEmail } from "../services/mailer.service.js";
import userModel from "../models/user.model.js";

/**
 * POST /api/payment/preview
 * Body: { items: ["colgate", "colgate", "parle_g", ...] }
 * Lightweight, no Razorpay order created — just returns the priced breakdown.
 * Called live as the trolley changes, so the UI can show a backend-derived
 * total before the user ever clicks checkout. Safe to call frequently.
 */
export const previewBill = async (req, res) => {
  try {
    const { items } = req.body;
    const bill = generateBill(items); // throws if empty/unknown item
    return res.status(200).json({ success: true, bill });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Could not compute bill",
    });
  }
};

/**
 * POST /api/payment/create-order
 * Body: { items: ["colgate", "colgate", "parle_g", ...] }
 * Called when user clicks "Checkout" — creates a Razorpay order for the
 * current trolley total. Does NOT touch the DB; trolley lives in frontend state.
 */
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    const bill = generateBill(items); // throws if empty/unknown item
    const order = await createRazorpayOrder(bill.totalAmount, bill.currency);

    return res.status(200).json({
      success: true,
      message: "Order created",
      order,
      bill, // frontend needs this to render the Razorpay checkout summary
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Could not create order",
    });
  }
};

/**
 * POST /api/payment/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, items }
 * Called by Razorpay checkout's success handler on the frontend.
 * On success: generates PDF, emails it, returns it for on-screen display.
 */
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
  } = req.body;

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

    // Re-derive the bill server-side from items — never trust a client-sent total
    const bill = generateBill(items);

    const user = await userModel.findById(req.user.id);
    const pdfBuffer = await generateBillPDF(bill, {
      username: user?.username,
      email: user?.email,
    });

    if (user?.email) {
      sendBillEmail({
        toEmail: user.email,
        username: user.username,
        pdfBuffer,
        totalAmount: bill.totalAmount,
      }).catch((err) => console.error("[mailer] failed to send receipt:", err.message));
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