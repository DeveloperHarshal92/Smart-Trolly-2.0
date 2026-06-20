// features/shop/services/payment.api.js
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
 * Live, side-effect-free bill preview — no Razorpay order created.
 */
export const previewBill = async (items) => {
  try {
    const response = await paymentApiInstance.post("/preview", { items });
    return response.data; // { bill }
  } catch (error) {
    throw new Error(extractError(error), { cause: error });
  }
};

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