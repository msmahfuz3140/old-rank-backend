import { Request, Response } from "express";
import multer from "multer";
import { uploadBufferToCloudinary, isCloudinaryConfigured } from "../config/cloudinary";

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
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("শুধুমাত্র ছবি (JPG, PNG, WEBP) এবং PDF ফাইল আপলোড গ্রহণযোগ্য।"));
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

    if (!isCloudinaryConfigured()) {
      // Graceful fallback for local development before user enters their Cloudinary credentials in .env
      const isPdf = file.originalname.toLowerCase().endsWith(".pdf");
      const simulatedUrl = isPdf
        ? `https://res.cloudinary.com/demo/image/upload/sample.pdf`
        : `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80`;

      res.status(200).json({
        success: true,
        message: "Cloudinary keys not detected in .env yet. Demo placeholder assigned.",
        url: simulatedUrl,
        public_id: `demo_${Date.now()}`,
        format: file.mimetype.split("/")[1] || "jpg",
        resource_type: isPdf ? "raw" : "image",
        bytes: file.size,
        originalName: file.originalname,
        isDemoFallback: true,
      });
      return;
    }

    const folder = req.body.folder || (file.originalname.toLowerCase().endsWith(".pdf") ? "old-rank/documents" : "old-rank/products");
    const result = await uploadBufferToCloudinary(file.buffer, file.originalname, folder);

    res.status(200).json({
      success: true,
      message: "ফাইল সফলভাবে ক্লাউডিনারিতে আপলোড হয়েছে!",
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
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

    if (!isCloudinaryConfigured()) {
      const simulatedResults = files.map((f, i) => ({
        url: `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80`,
        public_id: `demo_${Date.now()}_${i}`,
        originalName: f.originalname,
        resource_type: "image",
      }));

      res.status(200).json({
        success: true,
        message: "Demo placeholder files assigned (Configure CLOUDINARY_* in .env for live uploads).",
        results: simulatedResults,
      });
      return;
    }

    const uploadPromises = files.map((file) => {
      const folder = req.body.folder || (file.originalname.toLowerCase().endsWith(".pdf") ? "old-rank/documents" : "old-rank/products");
      return uploadBufferToCloudinary(file.buffer, file.originalname, folder);
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${results.length}টি ফাইল সফলভাবে আপলোড হয়েছে!`,
      results: results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
        format: r.format,
        resource_type: r.resource_type,
        bytes: r.bytes,
      })),
    });
  } catch (error: any) {
    console.error("Multi-upload Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "মাল্টিপল ফাইল আপলোডে ত্রুটি দেখা দিয়েছে।",
    });
  }
};
