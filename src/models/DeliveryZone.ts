import mongoose, { Document, Schema } from "mongoose";

export interface IDeliveryZone extends Document {
  division: string;
  district: string;
  deliveryCharge: number;
  estimatedDelivery: string;
  isActive: boolean;
}

const DeliveryZoneSchema = new Schema<IDeliveryZone>(
  {
    division: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true, unique: true },
    deliveryCharge: { type: Number, required: true },
    estimatedDelivery: { type: String, default: "2-3 business days" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DeliveryZone =
  mongoose.models.DeliveryZone ||
  mongoose.model<IDeliveryZone>("DeliveryZone", DeliveryZoneSchema);
