import { Router } from "express";
import {
  saveIncompleteOrder,
  getIncompleteOrders,
} from "../controllers/incompleteOrderController";

const router = Router();

router.post("/", saveIncompleteOrder);
router.get("/", getIncompleteOrders);

export default router;
