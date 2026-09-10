import { Router } from "express";
import {
  getHotDealSettings,
  updateHotDealSettings,
} from "../controllers/settingsController";

const router = Router();

router.get("/hot-deal", getHotDealSettings);
router.patch("/hot-deal", updateHotDealSettings);
router.post("/hot-deal", updateHotDealSettings);

export default router;
