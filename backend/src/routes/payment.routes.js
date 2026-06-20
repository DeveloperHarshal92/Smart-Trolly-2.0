// routes/payment.routes.js

import { Router } from "express";
import { previewBill, createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/payment/preview
 * @desc Live, no-side-effect bill computation — called as trolley changes
 * @access Private
 */
router.post("/preview", protect, previewBill);

/**
 * @route POST /api/payment/create-order
 * @desc Create Razorpay order from current trolley items
 * @access Private
 */
router.post("/create-order", protect, createOrder);

/**
 * @route POST /api/payment/verify
 * @desc Verify Razorpay signature, generate + email PDF receipt
 * @access Private
 */
router.post("/verify", protect, verifyPayment);

export default router;