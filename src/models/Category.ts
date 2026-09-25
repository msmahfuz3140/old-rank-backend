import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parentId?: mongoose.Types.ObjectId | null;
  level: number; // 1 = Main, 2 = Subcategory, 3 = Childcategory
  isComingSoon?: boolean;
  subcategories?: Array<{ _id?: string; name: string; slug: string; level?: number }>;
  isActive: boolean;
}

const SubcategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    level: { type: Number, default: 2 },
  },
  { _id: true }
);

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    level: { type: Number, default: 1 },
    isComingSoon: { type: Boolean, default: false },
    subcategories: [SubcategorySchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
