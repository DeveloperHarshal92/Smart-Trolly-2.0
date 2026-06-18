// routes/payment.routes.js

import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

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