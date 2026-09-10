import { Router } from "express";
import { getPaymentGateways, verifyPaymentCallback } from "../controllers/paymentController";

const router = Router();

router.get("/gateways", getPaymentGateways);
router.get("/callback", verifyPaymentCallback);

export default router;
