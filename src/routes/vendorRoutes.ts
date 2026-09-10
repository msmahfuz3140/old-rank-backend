import { Router } from "express";
import {
  getVendors,
  getVendorBySlug,
  createVendor,
  registerSeller,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController";

const router = Router();

router.get("/", getVendors);
router.post("/register", registerSeller);
router.post("/", createVendor);
router.get("/:slug", getVendorBySlug);
router.patch("/:id", updateVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

export default router;
