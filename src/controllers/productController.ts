import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Vendor } from "../models/Vendor";

const fallbackCategories = [
  {
    _id: "c_jwy",
    name: "জুয়েলারি ও অলংকার",
    slug: "jewelry",
    icon: "Gem",
    image: "/images/jewelry-category.jpg",
    level: 1,
    isComingSoon: false,
    subcategories: [
      { _id: "sc_neck", name: "Necklaces & Chokers", slug: "necklaces", level: 2 },
      { _id: "sc_ear", name: "Earrings & Jhumkas", slug: "earrings", level: 2 },
      { _id: "sc_ring", name: "Rings & Bangles", slug: "rings-bangles", level: 2 },
    ],
  },
  {
    _id: "c6",
    name: "Women's Fashion",
    slug: "womens-fashion",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80",
    level: 1,
    isComingSoon: true,
    subcategories: [],
  },
  {
    _id: "c2",
    name: "Men's Fashion",
    slug: "fashion",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60",
    level: 1,
    isComingSoon: true,
    subcategories: [],
  },
  {
    _id: "c1",
    name: "Electronics & Gadgets",
    slug: "electronics",
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60",
    level: 1,
    isComingSoon: true,
    subcategories: [],
  },
  {
    _id: "c7",
    name: "Baby & Kids",
    slug: "baby-kids",
    icon: "Smile",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80",
    level: 1,
    isComingSoon: true,
    subcategories: [],
  },
  {
    _id: "c8",
    name: "Home & Kitchen Electric",
    slug: "home-appliances",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80",
    level: 1,
    isComingSoon: true,
    subcategories: [],
  },
  {
    _id: "c9",
    name: "Beauty & Cosmetics",
    slug: "beauty-cosmetics",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    level: 1,
    isComingSoon: true,
    subcategories: [],
  },
  {
    _id: "c3",
    name: "Smart Watch",
    slug: "smart-watch",
    icon: "Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    level: 1,
    isComingSoon: true,
    subcategories: [],
  },
];

let productsSyncVersion = Date.now();

export const touchProductsVersion = () => {
  productsSyncVersion = Date.now();
};

export const getProductsSyncVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    let count = 0;
    if (mongoose.connection.readyState === 1) {
      count = await Product.countDocuments();
    } else {
      count = fallbackProducts.length;
    }
    res.setHeader("Cache-Control", "no-cache");
    res.json({
      success: true,
      version: productsSyncVersion,
      count,
    });
  } catch (err: any) {
    res.json({ success: true, version: productsSyncVersion, count: 0 });
  }
};

let fallbackProducts: any[] = [];

// Helper to resolve category ID from input
async function resolveCategoryId(categoryInput: any): Promise<mongoose.Types.ObjectId> {
  if (categoryInput) {
    if (typeof categoryInput === "string") {
      if (mongoose.isValidObjectId(categoryInput)) {
        const found = await Category.findById(categoryInput);
        if (found) return found._id as mongoose.Types.ObjectId;
      }
      const foundBySlugOrName = await Category.findOne({
        $or: [{ slug: categoryInput }, { name: categoryInput }, { slug: categoryInput.toLowerCase() }],
      });
      if (foundBySlugOrName) return foundBySlugOrName._id as mongoose.Types.ObjectId;
    } else if (typeof categoryInput === "object") {
      if (categoryInput._id && mongoose.isValidObjectId(categoryInput._id)) {
        return new mongoose.Types.ObjectId(categoryInput._id);
      }
      if (categoryInput.slug || categoryInput.name) {
        const found = await Category.findOne({
          $or: [
            ...(categoryInput.slug ? [{ slug: categoryInput.slug }] : []),
            ...(categoryInput.name ? [{ name: categoryInput.name }] : []),
          ],
        });
        if (found) return found._id as mongoose.Types.ObjectId;
      }
    }
  }

  let defaultCat = await Category.findOne({ slug: "jewelry" });
  if (!defaultCat) {
    defaultCat = await Category.findOne();
  }
  if (!defaultCat) {
    defaultCat = await Category.create({
      name: "জুয়েলারি ও অলংকার",
      slug: "jewelry",
      level: 1,
      isActive: true,
    });
  }
  return defaultCat._id as mongoose.Types.ObjectId;
}

// Helper to resolve vendor ID from input
async function resolveVendorId(vendorInput: any): Promise<mongoose.Types.ObjectId> {
  if (vendorInput) {
    if (typeof vendorInput === "string") {
      if (mongoose.isValidObjectId(vendorInput)) {
        const found = await Vendor.findById(vendorInput);
        if (found) return found._id as mongoose.Types.ObjectId;
      }
      const found = await Vendor.findOne({
        $or: [{ slug: vendorInput }, { shopName: vendorInput }],
      });
      if (found) return found._id as mongoose.Types.ObjectId;
    } else if (typeof vendorInput === "object") {
      if (vendorInput._id && mongoose.isValidObjectId(vendorInput._id)) {
        return new mongoose.Types.ObjectId(vendorInput._id);
      }
      if (vendorInput.slug || vendorInput.shopName) {
        const found = await Vendor.findOne({
          $or: [
            ...(vendorInput.slug ? [{ slug: vendorInput.slug }] : []),
            ...(vendorInput.shopName ? [{ shopName: vendorInput.shopName }] : []),
          ],
        });
        if (found) return found._id as mongoose.Types.ObjectId;
      }
    }
  }

  let defaultVendor = await Vendor.findOne({ slug: "old-rank" });
  if (!defaultVendor) {
    defaultVendor = await Vendor.findOne();
  }
  if (!defaultVendor) {
    defaultVendor = await Vendor.create({
      shopName: "Old Rank Jewelry Official Store",
      slug: "old-rank",
      isVerified: true,
      rating: 5.0,
    });
  }
  return defaultVendor._id as mongoose.Types.ObjectId;
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, isHotDeal, includeInactive } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter: any = {};
      if (includeInactive !== "true") {
        filter.isActive = true;
      }

      if (category && category !== "all") {
        const catDoc = await Category.findOne({
          $or: [{ slug: String(category).toLowerCase() }, { name: String(category) }],
        });
        if (catDoc) {
          filter.category = catDoc._id;
        } else if (mongoose.isValidObjectId(category)) {
          filter.category = category;
        }
      }

      if (search) {
        const q = String(search).trim();
        filter.$or = [
          { name: { $regex: q, $options: "i" } },
          { tags: { $regex: q, $options: "i" } },
          { shortDescription: { $regex: q, $options: "i" } },
        ];
      }

      if (isHotDeal === "true") {
        filter.isHotDeal = true;
      }

      const products = await Product.find(filter)
        .populate("category", "name slug icon image")
        .populate("vendor", "shopName slug logo rating isVerified")
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(100);

      res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
      res.json({
        success: true,
        data: products,
        pagination: {
          total: products.length,
          page: 1,
          limit: products.length,
          pages: 1,
        },
      });
      return;
    }

    // Only reached if MongoDB is completely disconnected
    let filtered = [...fallbackProducts];
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category?.slug === category || p.category === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }
    if (isHotDeal === "true") {
      filtered = filtered.filter((p) => p.isHotDeal);
    }

    res.json({
      success: true,
      data: filtered,
      pagination: {
        total: filtered.length,
        page: 1,
        limit: filtered.length,
        pages: 1,
      },
    });
  } catch (error: any) {
    res.json({ success: true, data: fallbackProducts });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { includeInactive } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query: any = { slug };
      if (includeInactive !== "true") {
        query.isActive = true;
      }

      const dbProduct = await Product.findOne(query)
        .populate("category", "name slug icon image")
        .populate("vendor", "shopName slug logo rating isVerified");

      if (dbProduct) {
        const relatedProducts = await Product.find({ slug: { $ne: slug }, isActive: true })
          .populate("category", "name slug icon image")
          .populate("vendor", "shopName slug logo rating isVerified")
          .limit(4);

        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        res.json({
          success: true,
          data: {
            product: dbProduct,
            relatedProducts,
          },
        });
        return;
      }

      res.status(404).json({
        success: false,
        message: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি অথবা বর্তমানে নিষ্ক্রিয় রয়েছে।",
      });
      return;
    }

    const product = fallbackProducts.find((p) => p.slug === slug);
    if (!product) {
      res.status(404).json({ success: false, message: "প্রোডাক্টটি পাওয়া যায়নি" });
      return;
    }
    const relatedProducts = fallbackProducts.filter((p) => p.slug !== product.slug).slice(0, 4);

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuickView = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { includeInactive } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query: any = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
      if (includeInactive !== "true") {
        query.isActive = true;
      }

      const product = await Product.findOne(query)
        .populate("category", "name slug icon image")
        .populate("vendor", "shopName slug logo rating isVerified");

      if (product) {
        res.json({ success: true, data: product });
        return;
      }

      res.status(404).json({ success: false, message: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি।" });
      return;
    }

    const product = fallbackProducts.find((p) => p._id === id || p.slug === id);
    if (!product) {
      res.status(404).json({ success: false, message: "প্রোডাক্টটি পাওয়া যায়নি।" });
      return;
    }
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=1200");
    if (mongoose.connection.readyState === 1) {
      const dbCats = await Category.find({ isActive: true }).sort({ level: 1 }).maxTimeMS(5000);
      if (dbCats && dbCats.length > 0) {
        res.json({ success: true, data: dbCats });
        return;
      }
    }
    res.json({ success: true, data: fallbackCategories });
  } catch (error: any) {
    res.json({ success: true, data: fallbackCategories });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const cleanName = String(data.name || "").trim() || "Untitled Product";
    let baseSlug = (data.slug || cleanName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!baseSlug) baseSlug = `product-${Date.now().toString().slice(-4)}`;

    let generatedSlug = baseSlug;

    if (mongoose.connection.readyState === 1) {
      const categoryId = await resolveCategoryId(data.category);
      const vendorId = await resolveVendorId(data.vendor);

      const existingSlug = await Product.findOne({ slug: generatedSlug });
      if (existingSlug) {
        generatedSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }

      const rawTags = data.tags;
      const parsedTags = Array.isArray(rawTags)
        ? rawTags
        : typeof rawTags === "string"
        ? rawTags.split(",").map((s) => s.trim()).filter(Boolean)
        : ["jewelry", "old-rank"];

      const newProductDoc = await Product.create({
        name: cleanName,
        slug: generatedSlug,
        shortDescription: data.shortDescription || cleanName,
        description: data.description || cleanName,
        category: categoryId,
        vendor: vendorId,
        mainImage: data.mainImage || "/images/old-rank-banner.jpg",
        galleryImages:
          data.galleryImages && data.galleryImages.length > 0
            ? data.galleryImages
            : [data.mainImage || "/images/old-rank-banner.jpg"],
        basePrice: Number(data.basePrice) || 990,
        costPrice: Number(data.costPrice) || 0,
        oldPrice:
          Number(data.oldPrice) ||
          (Number(data.basePrice) ? Math.round(Number(data.basePrice) * 1.25) : 1250),
        discountPercentage:
          Number(data.discountPercentage) ||
          (data.oldPrice && data.basePrice
            ? Math.round(((Number(data.oldPrice) - Number(data.basePrice)) / Number(data.oldPrice)) * 100)
            : 20),
        sku: data.sku || `OR-${Date.now().toString().slice(-4)}`,
        stock: Number(data.stock) !== undefined && !isNaN(Number(data.stock)) ? Number(data.stock) : 50,
        isHotDeal: Boolean(data.isHotDeal),
        isFeatured: Boolean(data.isFeatured),
        isDigital: Boolean(data.isDigital),
        variants: Array.isArray(data.variants) ? data.variants : [],
        wholesalePrices: Array.isArray(data.wholesalePrices) ? data.wholesalePrices : [],
        rating: 5.0,
        reviewCount: 0,
        tags: parsedTags,
        isActive: true,
      });

      const populatedProduct = await Product.findById(newProductDoc._id)
        .populate("category", "name slug icon image")
        .populate("vendor", "shopName slug logo rating isVerified");

      fallbackProducts.unshift(populatedProduct.toObject ? populatedProduct.toObject() : populatedProduct);
      touchProductsVersion();

      res.status(201).json({
        success: true,
        message: "প্রোডাক্ট সফলভাবে MongoDB ডাটাবেজে যুক্ত করা হয়েছে!",
        data: populatedProduct,
      });
      return;
    }

    // In-memory fallback if DB is temporarily disconnected
    const fallbackProd = {
      _id: `p_${Date.now()}`,
      name: cleanName,
      slug: generatedSlug,
      shortDescription: data.shortDescription || cleanName,
      description: data.description || cleanName,
      category:
        typeof data.category === "object"
          ? data.category
          : { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
      vendor:
        typeof data.vendor === "object"
          ? data.vendor
          : { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
      mainImage: data.mainImage || "/images/old-rank-banner.jpg",
      galleryImages: data.galleryImages || [data.mainImage || "/images/old-rank-banner.jpg"],
      basePrice: Number(data.basePrice) || 990,
      costPrice: Number(data.costPrice) || 0,
      oldPrice: Number(data.oldPrice) || (Number(data.basePrice) ? Math.round(Number(data.basePrice) * 1.25) : 1250),
      discountPercentage: Number(data.discountPercentage) || 20,
      sku: data.sku || `OR-${Date.now().toString().slice(-4)}`,
      stock: Number(data.stock) !== undefined ? Number(data.stock) : 50,
      isHotDeal: Boolean(data.isHotDeal),
      isFeatured: Boolean(data.isFeatured),
      rating: 5.0,
      reviewCount: 0,
      tags: data.tags || ["jewelry"],
      createdAt: new Date().toISOString(),
    };

    fallbackProducts.unshift(fallbackProd);
    touchProductsVersion();

    res.status(201).json({
      success: true,
      message: "প্রোডাক্ট সফলভাবে পোস্ট করা হয়েছে!",
      data: fallbackProd,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (Array.isArray(updates.galleryImages) && updates.galleryImages.length > 0 && !updates.mainImage) {
      updates.mainImage = updates.galleryImages[0];
    }

    if (mongoose.connection.readyState === 1) {
      if (updates.category) {
        updates.category = await resolveCategoryId(updates.category);
      }
      if (updates.vendor) {
        updates.vendor = await resolveVendorId(updates.vendor);
      }

      const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };

      const updated = await Product.findOneAndUpdate(query, updates, { new: true })
        .populate("category", "name slug icon image")
        .populate("vendor", "shopName slug logo rating isVerified");

      if (updated) {
        const idx = fallbackProducts.findIndex((p) => p._id === id || p.slug === id);
        if (idx !== -1) {
          fallbackProducts[idx] = updated.toObject ? updated.toObject() : updated;
        }
        touchProductsVersion();

        res.json({
          success: true,
          message: "প্রোডাক্ট সফলভাবে MongoDB ডাটাবেজে আপডেট করা হয়েছে!",
          data: updated,
        });
        return;
      }
    }

    const idx = fallbackProducts.findIndex((p) => p._id === id || p.slug === id);
    if (idx !== -1) {
      fallbackProducts[idx] = { ...fallbackProducts[idx], ...updates };
      touchProductsVersion();
      res.json({
        success: true,
        message: "প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে!",
        data: fallbackProducts[idx],
      });
      return;
    }

    res.status(404).json({
      success: false,
      message: "আপডেটের জন্য প্রোডাক্টটি খুঁজে পাওয়া যায়নি!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
      const deleted = await Product.findOneAndDelete(query);

      fallbackProducts = fallbackProducts.filter((p) => p._id !== id && p.slug !== id);
      touchProductsVersion();

      if (deleted) {
        res.json({
          success: true,
          message: "প্রোডাক্ট সফলভাবে MongoDB ডাটাবেজ থেকে মুছে ফেলা হয়েছে!",
          id,
          data: deleted,
        });
        return;
      }
    }

    fallbackProducts = fallbackProducts.filter((p) => p._id !== id && p.slug !== id);
    touchProductsVersion();

    res.json({
      success: true,
      message: "প্রোডাক্ট মুছে ফেলা হয়েছে!",
      id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      res.status(400).json({ success: false, message: "orderedIds array is required" });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const bulkOps = orderedIds.map((id: string, index: number) => {
        const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
        return {
          updateOne: {
            filter: query,
            update: { $set: { sortOrder: index } },
          },
        };
      });

      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
      }

      // Ensure any products not in orderedIds get a higher sortOrder so they never jump ahead of index 0
      const validIds = orderedIds.filter((id: string) => mongoose.isValidObjectId(id));
      if (validIds.length > 0) {
        await Product.updateMany(
          { _id: { $nin: validIds }, sortOrder: { $lt: orderedIds.length } },
          { $set: { sortOrder: orderedIds.length + 10 } }
        );
      }
    }

    // Also reorder fallbackProducts array in memory
    const orderMap = new Map<string, number>();
    orderedIds.forEach((id: string, idx: number) => orderMap.set(String(id), idx));

    fallbackProducts.sort((a, b) => {
      const orderA = orderMap.has(String(a._id)) ? orderMap.get(String(a._id))! : 9999;
      const orderB = orderMap.has(String(b._id)) ? orderMap.get(String(b._id))! : 9999;
      return orderA - orderB;
    });
    touchProductsVersion();

    res.json({
      success: true,
      message: "প্রোডাক্টের ক্রম সফলভাবে ডাটাবেজে আপডেট করা হয়েছে!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
