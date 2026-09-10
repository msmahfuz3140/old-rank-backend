import mongoose, { Document, Schema } from "mongoose";

export interface IProductVariant {
  id?: string;
  colorName?: string;
  colorHex?: string;
  sizeName?: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface IWholesalePrice {
  minQuantity: number;
  price: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  vendor?: mongoose.Types.ObjectId;
  mainImage: string;
  galleryImages: string[];
  basePrice: number;
  oldPrice?: number;
  discountPercentage?: number;
  sku: string;
  stock: number;
  isHotDeal: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  variants: IProductVariant[];
  wholesalePrices: IWholesalePrice[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    colorName: { type: String, default: "" },
    colorHex: { type: String, default: "" },
    sizeName: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sku: { type: String, default: "" },
  },
  { _id: true }
);

const WholesalePriceSchema = new Schema<IWholesalePrice>(
  {
    minQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", default: null },
    mainImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    basePrice: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    sku: { type: String, default: "" },
    stock: { type: Number, default: 10 },
    isHotDeal: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isDigital: { type: Boolean, default: false },
    variants: [ProductVariantSchema],
    wholesalePrices: [WholesalePriceSchema],
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", tags: "text" });

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
