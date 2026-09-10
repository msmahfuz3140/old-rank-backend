import mongoose, { Document, Schema } from "mongoose";

export interface IVendor extends Document {
  shopName: string;
  slug: string;
  logo: string;
  banner: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  totalProducts: number;
  phone: string;
  address: string;
  description: string;
  joinedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    shopName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    totalProducts: { type: Number, default: 0 },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    description: { type: String, default: "" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Vendor = mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema);
