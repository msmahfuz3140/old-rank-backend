import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";
import sharp from "sharp";

// Initial load
dotenv.config({ override: true });

export const configureCloudinary = () => {
  dotenv.config({ override: true });
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
    secure: true,
  });
  return cloudinary;
};

// Initial config
configureCloudinary();

export const isCloudinaryConfigured = (): boolean => {
  dotenv.config({ override: true });
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Optimizes an image buffer using sharp:
 * - Resizes max dimensions to 1600x1600 (without enlarging)
 * - Converts to progressive, mozjpeg-compressed JPEG (quality 80)
 * - Greatly reduces file size from multi-MB down to lightweight KB
 * - Preserves PDF / SVG without alteration
 */
export const optimizeImageBuffer = async (
  buffer: Buffer,
  originalName: string
): Promise<{ buffer: Buffer; format: string; isOptimized: boolean }> => {
  const lowerName = originalName.toLowerCase();
  const isPdf = lowerName.endsWith(".pdf");
  const isSvg = lowerName.endsWith(".svg");

  if (isPdf || isSvg) {
    return { buffer, format: isPdf ? "pdf" : "svg", isOptimized: false };
  }

  try {
    const originalKb = (buffer.length / 1024).toFixed(1);
    const optimized = await sharp(buffer)
      .rotate() // auto-orient based on EXIF
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();

    const optimizedKb = (optimized.length / 1024).toFixed(1);
    const savedPct = Math.max(0, Math.round(((buffer.length - optimized.length) / buffer.length) * 100));

    console.log(
      `📸 Image optimized (${originalName}): ${originalKb} KB -> ${optimizedKb} KB (${savedPct}% reduction, progressive JPEG)`
    );

    return { buffer: optimized, format: "jpg", isOptimized: true };
  } catch (error: any) {
    console.warn(`⚠️ Sharp image optimization skipped for ${originalName}: ${error?.message || error}`);
    return { buffer, format: "original", isOptimized: false };
  }
};

/**
 * Uploads a file buffer (Image or PDF) directly to Cloudinary with compression & CDN bandwidth optimization
 */
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  originalName: string,
  folder: string = "old-rank/products"
): Promise<UploadApiResponse & { delivery_url?: string }> => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary credentials are not configured in backend .env! Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  const client = configureCloudinary();
  const lowerName = originalName.toLowerCase();
  const isPdf = lowerName.endsWith(".pdf");

  // Step 1: Compress large images into lightweight KB JPEG before sending to Cloudinary
  const { buffer: uploadBuffer, format } = await optimizeImageBuffer(buffer, originalName);

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: isPdf ? "raw" : "image",
        format: isPdf ? undefined : (format === "jpg" ? "jpg" : undefined),
        transformation: isPdf
          ? undefined
          : [
              { quality: "auto:good" },
              { fetch_format: "auto" },
            ],
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload failed with empty response"));
        }

        // Generate optimized delivery URL with auto-format and auto-quality for browser caching
        let deliveryUrl = result.secure_url;
        if (!isPdf && deliveryUrl.includes("/image/upload/")) {
          deliveryUrl = deliveryUrl.replace(
            "/image/upload/",
            "/image/upload/f_auto,q_auto/"
          );
        }

        resolve({
          ...result,
          delivery_url: deliveryUrl,
        });
      }
    );

    Readable.from(uploadBuffer).pipe(uploadStream);
  });
};

export default cloudinary;

