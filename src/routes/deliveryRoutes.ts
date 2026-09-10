import { Router } from "express";
import { getDeliveryZones } from "../controllers/deliveryZoneController";

const router = Router();

router.get("/zones", getDeliveryZones);

export default router;
