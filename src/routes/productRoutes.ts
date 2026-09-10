import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  getQuickView,
  getCategories,
} from "../controllers/productController";

const router = Router();

router.get("/categories", getCategories);
router.get("/quick-view/:id", getQuickView);
router.get("/slug/:slug", getProductBySlug);
router.get("/", getProducts);

export default router;
