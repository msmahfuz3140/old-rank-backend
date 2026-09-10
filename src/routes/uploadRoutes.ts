import { Router } from "express";
import {
  uploadMiddleware,
  handleSingleUpload,
  handleMultipleUpload,
} from "../controllers/uploadController";

const router = Router();

// Single file upload (supports field name "file" or "image")
router.post("/", uploadMiddleware.single("file"), handleSingleUpload);
router.post("/image", uploadMiddleware.single("image"), handleSingleUpload);

// Multiple files upload
router.post("/multiple", uploadMiddleware.array("files", 10), handleMultipleUpload);

export default router;
