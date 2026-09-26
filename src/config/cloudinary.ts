import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";

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
 * Uploads a file buffer (Image or PDF / Raw document) directly to Cloudinary via stream
 */
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  originalName: string,
  folder: string = "old-rank/products"
): Promise<UploadApiResponse> => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary credentials are not configured in backend .env! Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  const client = configureCloudinary();

  return new Promise((resolve, reject) => {
    const isPdf = originalName.toLowerCase().endsWith(".pdf");
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: isPdf ? "raw" : "auto",
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
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export default cloudinary;
