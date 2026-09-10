import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  image: string;
  variantInfo?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface IOrderTimeline {
  status: string;
  timestamp: Date;
  note: string;
}

export interface IOrder extends Document {
  invoiceId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    division: string;
    district: string;
    note?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  grandTotal: number;
  paymentMethod:
    | "cod"
    | "bkash_manual"
    | "nagad_manual"
    | "rocket_manual"
    | "bkash_auto"
    | "nagad_auto"
    | "card_auto";
  paymentStatus: "pending" | "paid" | "pending_verification" | "failed";
  manualPaymentDetails?: {
    trxId: string;
    senderNumber?: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  timeline: IOrderTimeline[];
  couponCode?: string;
  trafficSource?: string;
  trafficReferrer?: string;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.Mixed, default: "" },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    variantInfo: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    total: {
      type: Number,
      default: function (this: IOrderItem) {
        return (this.price || 0) * (this.quantity || 1);
      },
    },
  },
  { _id: false }
);

const OrderTimelineSchema = new Schema<IOrderTimeline>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    invoiceId: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, index: true },
      address: { type: String, required: true, trim: true },
      division: { type: String, required: true },
      district: { type: String, required: true },
      note: { type: String, default: "" },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: [
        "cod",
        "bkash_manual",
        "nagad_manual",
        "rocket_manual",
        "bkash_auto",
        "nagad_auto",
        "card_auto",
      ],
      required: true,
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "pending_verification", "failed"],
      default: "pending",
    },
    manualPaymentDetails: {
      trxId: { type: String, default: "" },
      senderNumber: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    timeline: [OrderTimelineSchema],
    couponCode: { type: String, default: "" },
    trafficSource: { type: String, default: "direct" },
    trafficReferrer: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
