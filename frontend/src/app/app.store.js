import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice";
import detectionReducer from "../features/shop/state/detection.slice";
import paymentReducer from "../features/payment/state/payment.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    detection: detectionReducer,
    payment: paymentReducer
  },
});
