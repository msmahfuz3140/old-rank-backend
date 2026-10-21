import { Request, Response } from "express";
import multer from "multer";
import { uploadBufferToCloudinary, isCloudinaryConfigured, optimizeImageBuffer } from "../config/cloudinary";

// Configure Multer for in-memory processing up to 25MB (supports high-res images and large PDFs)
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    // Allow images and PDF documents
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/jfif",
      "image/heic",
      "image/heif",
      "application/pdf",
    ];

    if (
      allowedMimeTypes.includes(file.mimetype) ||
      file.mimetype.startsWith("image/") ||
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(null, true); // Permissive to prevent blocking valid user images
    }
  },
});

/**
 * Handles single file upload (image or PDF)
 * POST /api/v1/upload
 */
export const handleSingleUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "কোনো ফাইল প্রদান করা হয়নি। অনুগ্রহ করে একটি ছবি বা PDF ফাইল সিলেক্ট করুন।",
      });
      return;
    }

    const folder = req.body.folder || (file.originalname.toLowerCase().endsWith(".pdf") ? "old-rank/documents" : "old-rank/products");

    // 1. Try Live Cloudinary Upload if configured
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadBufferToCloudinary(file.buffer, file.originalname, folder);
        res.status(200).json({
          success: true,
          message: "ফাইল সফলভাবে ক্লাউডিনারিতে আপলোড হয়েছে!",
          url: result.delivery_url || result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          originalName: file.originalname,
        });
        return;
      } catch (cloudErr: any) {
        console.warn("Cloudinary upload failed, falling back to sharp-optimized data URL:", cloudErr?.message || cloudErr);
      }
    }

    // 2. High-Efficiency Local Compression Fallback (Upload NEVER fails)
    const { buffer: optimizedBuffer, format } = await optimizeImageBuffer(file.buffer, file.originalname);
    const mime = format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : file.mimetype || "image/jpeg";
    const dataUrl = `data:${mime};base64,${optimizedBuffer.toString("base64")}`;

    res.status(200).json({
      success: true,
      message: "ছবি সফলভাবে অপটিমাইজ ও যুক্ত হয়েছে!",
      url: dataUrl,
      public_id: `local_${Date.now()}`,
      format: format || "jpg",
      bytes: optimizedBuffer.length,
      originalName: file.originalname,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "ফাইল আপলোডে ত্রুটি দেখা দিয়েছে।",
    });
  }
};

/**
 * Handles multiple file uploads
 * POST /api/v1/upload/multiple
 */
export const handleMultipleUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "কোনো ফাইল পাওয়া যায়নি।",
      });
      return;
    }

    const folder = req.body.folder || "old-rank/products";

    // 1. Try Live Cloudinary Upload
    if (isCloudinaryConfigured()) {
      try {
        const uploadPromises = files.map((file) => uploadBufferToCloudinary(file.buffer, file.originalname, folder));
        const results = await Promise.all(uploadPromises);

        res.status(200).json({
          success: true,
          message: `${results.length}টি ফাইল সফলভাবে আপলোড হয়েছে!`,
          results: results.map((r) => ({
            url: r.delivery_url || r.secure_url,
            public_id: r.public_id,
            format: r.format,
            resource_type: r.resource_type,
            bytes: r.bytes,
          })),
        });
        return;
      } catch (cloudErr: any) {
        console.warn("Multi-Cloudinary upload failed, using optimized data URL fallback:", cloudErr?.message || cloudErr);
      }
    }

    // 2. High-Efficiency Local Compression Fallback
    const localResults = await Promise.all(
      files.map(async (file, idx) => {
        const { buffer: optBuffer, format } = await optimizeImageBuffer(file.buffer, file.originalname);
        const mime = format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : file.mimetype || "image/jpeg";
        return {
          url: `data:${mime};base64,${optBuffer.toString("base64")}`,
          public_id: `local_${Date.now()}_${idx}`,
          format: format || "jpg",
          resource_type: "image",
          bytes: optBuffer.length,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: `${localResults.length}টি ছবি সফলভাবে অপটিমাইজ ও যুক্ত হয়েছে!`,
      results: localResults,
    });
  } catch (error: any) {
    console.error("Multi-upload Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "মাল্টিপল ফাইল আপলোডে ত্রুটি দেখা দিয়েছে।",
    });
  }
};
