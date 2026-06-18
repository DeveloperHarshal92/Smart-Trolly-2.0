// features/shop/hooks/useCheckout.js
// Bridges Redux thunks with the Razorpay SDK's callback-based checkout modal.
// Razorpay's checkout.open() doesn't return a promise — it fires a handler
// callback. We wrap that here so the UI layer just calls one async function.

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initiateCheckout,
  confirmPayment,
  setAwaitingPayment,
  resetPayment,
} from "../state/payment.slice";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

/**
 * Loads the Razorpay checkout script once. Safe to call multiple times —
 * resolves immediately if already loaded.
 */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export const useCheckout = () => {
  const dispatch = useDispatch();
  const { status, error, currentOrder, receipt } = useSelector((s) => s.payment);

  /**
   * Full checkout flow: create order -> open Razorpay modal -> verify on success.
   * @param {string[]} items - trolley labels, e.g. ["colgate", "parle_g"]
   * @param {{ username: string, email: string }} user
   */
  const startCheckout = useCallback(async (items, user) => {
    if (!items || items.length === 0) {
      return;
    }

    // 1. Create order on backend
    const result = await dispatch(initiateCheckout(items));
    if (!initiateCheckout.fulfilled.match(result)) {
      return; // error already in state via rejected case
    }

    const { order, bill } = result.payload;

    // 2. Load Razorpay SDK
    try {
      await loadRazorpayScript();
    } catch (err) {
      dispatch(resetPayment());
      return;
    }

    // 3. Open checkout modal
    dispatch(setAwaitingPayment());

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Smart Trolly 2.0",
      description: `${items.length} items`,
      order_id: order.id,
      prefill: {
        name: user?.username || "",
        email: user?.email || "",
      },
      theme: { color: "#10b981" }, // emerald-500, matches your UI

      handler: (response) => {
        // Razorpay calls this on successful payment
        dispatch(confirmPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          items,
        }));
      },

      modal: {
        ondismiss: () => {
          // User closed the modal without paying
          dispatch(resetPayment());
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  }, [dispatch]);

  return {
    status,
    error,
    currentOrder,
    receipt,
    startCheckout,
    resetPayment: () => dispatch(resetPayment()),
  };
};