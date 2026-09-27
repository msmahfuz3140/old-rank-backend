import { Router } from "express";
import {
  getProductReviews,
  createReview,
  checkCustomerRecentOrders,
} from "../controllers/reviewController";

const router = Router();

router.get("/product/:idOrSlug", getProductReviews);
router.post("/", createReview);
router.get("/customer-orders", checkCustomerRecentOrders);

export default router;
