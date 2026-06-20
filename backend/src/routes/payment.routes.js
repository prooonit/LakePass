import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createCheckoutController } from "../controllers/payment.controller.js";
import { stripeWebhook } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/checkout-session",authenticate,createCheckoutController);
router.post("/webhook",express.raw({ type: "application/json" }),stripeWebhook);

export default router;