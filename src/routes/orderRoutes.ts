import { Router } from "express";
import {
  createOrder,
  trackOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getAdminStats,
  updatePaymentStatus,
} from "../controllers/orderController";

const router = Router();

router.post("/", createOrder);
router.get("/admin/stats", getAdminStats);
router.get("/track", trackOrder);
router.get("/", getAllOrders);
router.get("/:invoiceId", getOrderById);
router.patch("/:invoiceId/status", updateOrderStatus);
router.patch("/:invoiceId/payment-status", updatePaymentStatus);

export default router;

