import mongoose, { Document, Schema } from "mongoose";

export interface IHotDealSettings {
  isOfferActive: boolean;
  offerTitle: string;
  offerSubtitle: string;
  offerEndTime: string;
  discountBadge: string;
}

export interface ISettings extends Document {
  key: string;
  hotDeal: IHotDealSettings;
}

const HotDealSettingsSchema = new Schema<IHotDealSettings>(
  {
    isOfferActive: { type: Boolean, default: true },
    offerTitle: { type: String, default: "হট ডিল কালেকশন" },
    offerSubtitle: { type: String, default: "সবচেয়ে বেশি বিক্রিত পণ্যগুলোতে বিশাল ডিসকাউন্ট অফার" },
    offerEndTime: {
      type: String,
      default: () => new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    },
    discountBadge: { type: String, default: "সীমিত স্টক" },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: "site_settings" },
    hotDeal: { type: HotDealSettingsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Settings =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
