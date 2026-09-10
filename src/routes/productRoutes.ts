import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  getQuickView,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

router.get("/categories", getCategories);
router.get("/quick-view/:id", getQuickView);
router.get("/slug/:slug", getProductBySlug);
router.get("/", getProducts);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
