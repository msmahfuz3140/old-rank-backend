import { Router } from "express";
import { getVendors, getVendorBySlug } from "../controllers/vendorController";

const router = Router();

router.get("/", getVendors);
router.get("/:slug", getVendorBySlug);

export default router;
