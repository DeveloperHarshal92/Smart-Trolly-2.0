// features/shop/state/payment.slice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder as createOrderAPI, verifyPayment as verifyPaymentAPI } from "../services/payment.api";

export const initiateCheckout = createAsyncThunk(
  "payment/initiateCheckout",
  async (items, { rejectWithValue }) => {
    try {
      const res = await createOrderAPI(items);
      return res; // { order, bill }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const confirmPayment = createAsyncThunk(
  "payment/confirmPayment",
  async (verificationData, { rejectWithValue }) => {
    try {
      const res = await verifyPaymentAPI(verificationData);
      return res; // { bill, pdfBase64 }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    status: "idle",       // idle | creating_order | awaiting_payment | verifying | success | failed
    error: null,
    currentOrder: null,    // { order, bill } from create-order
    receipt: null,         // { bill, pdfBase64 } from verify
  },
  reducers: {
    resetPayment: (state) => {
      state.status = "idle";
      state.error = null;
      state.currentOrder = null;
      state.receipt = null;
    },
    setAwaitingPayment: (state) => {
      state.status = "awaiting_payment";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateCheckout.pending, (state) => {
        state.status = "creating_order";
        state.error = null;
      })
      .addCase(initiateCheckout.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        // status moves to "awaiting_payment" explicitly once Razorpay modal opens —
        // handled by the hook calling setAwaitingPayment, not here
      })
      .addCase(initiateCheckout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(confirmPayment.pending, (state) => {
        state.status = "verifying";
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.status = "success";
        state.receipt = action.payload;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetPayment, setAwaitingPayment } = paymentSlice.actions;
export default paymentSlice.reducer;