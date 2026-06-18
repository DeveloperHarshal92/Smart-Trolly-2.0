// services/payment.service.js
// Adapted from your e-commerce reference — stripped of productModel/variantId
// dependencies. Works directly on the billing.service.js output.

import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a Razorpay order for the given amount.
 * @param {number} amount - in rupees (NOT paise — converted internally)
 * @param {string} currency
 * @returns {Promise<object>} Razorpay order object
 */
export async function createRazorpayOrder(amount, currency = "INR") {
  const options = {
    amount: Math.round(amount * 100), // INR -> paise
    currency,
    receipt: `trolley_${Date.now()}`,
  };
  return await razorpay.orders.create(options);
}

/**
 * Verifies the signature Razorpay sends back after checkout.
 * Throws nothing — returns boolean. Caller decides what to do on failure.
 */
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  return validatePaymentVerification(
    { order_id: orderId, payment_id: paymentId },
    signature,
    config.RAZORPAY_KEY_SECRET,
  );
}