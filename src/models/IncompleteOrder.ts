import mongoose, { Document, Schema } from "mongoose";

export interface IIncompleteOrder extends Document {
  sessionId?: string;
  phone: string;
  name?: string;
  address?: string;
  division?: string;
  district?: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  deliveryCharge: number;
  isConverted: boolean;
  convertedOrderId?: mongoose.Types.ObjectId;
  lastActiveAt: Date;
}

const IncompleteOrderSchema = new Schema<IIncompleteOrder>(
  {
    sessionId: { type: String, default: "" },
    phone: { type: String, required: true, trim: true, index: true },
    name: { type: String, default: "" },
    address: { type: String, default: "" },
    division: { type: String, default: "" },
    district: { type: String, default: "" },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        image: { type: String, default: "" },
      },
    ],
    subtotal: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    isConverted: { type: Boolean, default: false },
    convertedOrderId: { type: Schema.Types.ObjectId, ref: "Order", default: null },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const IncompleteOrder =
  mongoose.models.IncompleteOrder ||
  mongoose.model<IIncompleteOrder>("IncompleteOrder", IncompleteOrderSchema);
