import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  productSlug?: string;
  customerName: string;
  customerPhone?: string;
  customerCity?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  orderInvoiceId?: string;
  status: "approved" | "pending" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    productSlug: { type: String, default: "", index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, default: "", trim: true },
    customerCity: { type: String, default: "", trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true, trim: true },
    isVerifiedPurchase: { type: Boolean, default: false },
    orderInvoiceId: { type: String, default: "", trim: true },
    status: { type: String, enum: ["approved", "pending", "rejected"], default: "approved" },
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
