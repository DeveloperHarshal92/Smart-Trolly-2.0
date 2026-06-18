// features/shop/services/payment.api.js
// Transport only — no Razorpay SDK logic here, that lives in the hook.

import axios from "axios";

const paymentApiInstance = axios.create({
  baseURL: "/api/payment",
  withCredentials: true,
});

const extractError = (error) => {
  if (error.response?.data) {
    const d = error.response.data;
    return d.message || d.error || d.errors?.[0]?.msg || "Request failed";
  }
  if (error.request) return "Server is unreachable. Please try again later.";
  return "An unexpected error occurred";
};

/**
 * @param {string[]} items - flat array of detected labels, e.g. ["colgate", "parle_g"]
 */
export const createOrder = async (items) => {
  try {
    const response = await paymentApiInstance.post("/create-order", { items });
    return response.data; // { order, bill }
  } catch (error) {
    throw new Error(extractError(error), { cause: error });
  }
};

export const verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  items,
}) => {
  try {
    const response = await paymentApiInstance.post("/verify", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
    });
    return response.data; // { bill, pdfBase64 }
  } catch (error) {
    throw new Error(extractError(error), { cause: error });
  }
};