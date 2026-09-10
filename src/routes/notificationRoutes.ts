import { Router } from "express";
import { getSalesNotifications } from "../controllers/notificationController";

const router = Router();

router.get("/sales", getSalesNotifications);

export default router;
