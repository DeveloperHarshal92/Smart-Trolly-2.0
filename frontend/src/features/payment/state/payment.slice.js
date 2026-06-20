// features/shop/state/payment.slice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  previewBill as previewBillAPI,
  createOrder as createOrderAPI,
  verifyPayment as verifyPaymentAPI,
} from "../services/payment.api";

// Live preview — fired as trolley changes, debounced in the hook layer.
// Silent-fail on error (e.g. empty trolley) since this isn't a user action.
export const fetchPreviewBill = createAsyncThunk(
  "payment/fetchPreviewBill",
  async (items, { rejectWithValue }) => {
    try {
      const res = await previewBillAPI(items);
      return res.bill;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const initiateCheckout = createAsyncThunk(
  "payment/initiateCheckout",
  async (items, { rejectWithValue }) => {
    try {
      const res = await createOrderAPI(items);
      return res;
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
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    status: "idle",
    error: null,
    currentOrder: null,
    receipt: null,
    previewBill: null,    // { lineItems, totalAmount, currency } — live, backend-derived
    previewLoading: false,
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
      // Preview — does NOT touch `status`/`error`, those are reserved for the
      // actual checkout flow. Preview failures (e.g. empty trolley) are normal,
      // not error states the user needs to see.
      .addCase(fetchPreviewBill.pending, (state) => {
        state.previewLoading = true;
      })
      .addCase(fetchPreviewBill.fulfilled, (state, action) => {
        state.previewLoading = false;
        state.previewBill = action.payload;
      })
      .addCase(fetchPreviewBill.rejected, (state) => {
        state.previewLoading = false;
        state.previewBill = null;
      })

      .addCase(initiateCheckout.pending, (state) => {
        state.status = "creating_order";
        state.error = null;
      })
      .addCase(initiateCheckout.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
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