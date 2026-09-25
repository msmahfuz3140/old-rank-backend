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
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80",
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

let fallbackProducts: any[] = [
  {
    _id: "p_j1",
    name: "Traditional 22K Gold Plated Bridal Choker Necklace Set",
    slug: "traditional-22k-gold-plated-bridal-necklace-set",
    shortDescription: "এক্সক্লুসিভ ব্রাইডাল কুন্দন ও পার্ল ডিজাইনের প্রিমিয়াম গোল্ড প্লেটেড নেকলেস সেট",
    description: "অসাধারণ কারুকার্যমণ্ডিত প্রিমিয়াম কোয়ালিটি কুন্দন ও পার্ল ডিজাইনের এই নেকলেস সেটটি আপনার বিশেষ দিনের সৌন্দর্য বহুগুণ বাড়িয়ে তুলবে। সাথে পাচ্ছেন মানানসই ম্যাচিং ঝুমকা কানের দুল ও টিকলি। দীর্ঘস্থায়ী গোল্ড পলিশ গ্যারান্টি।",
    category: { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
    subCategory: { _id: "sc_neck", name: "Necklaces & Chokers", slug: "necklaces" },
    vendor: { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 2450,
    costPrice: 1350,
    oldPrice: 3500,
    discountPercentage: 30,
    sku: "JW-NCK-001",
    stock: 25,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 42,
    tags: ["jewelry", "necklace", "bridal", "gold plated", "choker"],
  },
  {
    _id: "p_j2",
    name: "Crystal Emerald Green Stone Royal Party Earrings",
    slug: "crystal-emerald-green-royal-party-earrings",
    shortDescription: "রয়েল এমারেল্ড গ্রিন ক্রিস্টাল ড্রপলেট স্টোনের লাক্সারি পার্টি ইয়াররিংস",
    description: "উচ্চমানের অস্ট্রিয়ান ক্রিস্টাল ও এমারেল্ড গ্রিন জেমস্টোনে তৈরি রাজকীয় ডিজাইনের কানের দুল। হালকা ওজনে পরতে আরামদায়ক এবং যেকোনো পার্টি বা বিয়ের অনুষ্ঠানে নজরকাড়া লুক দেবে।",
    category: { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
    subCategory: { _id: "sc_ear", name: "Earrings & Jhumkas", slug: "earrings" },
    vendor: { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 850,
    costPrice: 420,
    oldPrice: 1250,
    discountPercentage: 32,
    sku: "JW-EAR-002",
    stock: 40,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 29,
    tags: ["jewelry", "earrings", "emerald", "crystal", "party wear"],
  },
  {
    _id: "p_j3",
    name: "Handcrafted Antique Kundan Floral Finger Ring",
    slug: "handcrafted-antique-kundan-floral-finger-ring",
    shortDescription: "হাতে তৈরি এন্টিক ফ্লোরাল কুন্দন এডজাস্টেবল আংটি",
    description: "যেকোনো আঙুলের সাইজের জন্য পারফেক্ট এডজাস্টেবল সাইজ। রয়্যাল এন্টিক ফিনিশ ও কুন্দন স্টোনের নিপুণ কারুকাজ।",
    category: { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
    subCategory: { _id: "sc_ring", name: "Rings & Bangles", slug: "rings-bangles" },
    vendor: { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 650,
    costPrice: 320,
    oldPrice: 950,
    discountPercentage: 31,
    sku: "JW-RNG-003",
    stock: 50,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 18,
    tags: ["jewelry", "ring", "kundan", "antique"],
  },
  {
    _id: "p_j4",
    name: "Classic 24K Micron Gold Plated Textured Bangles (Pair)",
    slug: "classic-24k-micron-gold-plated-textured-bangles-pair",
    shortDescription: "২ জোড়া প্রিমিয়াম গোল্ড পলিশ টেক্সচার্ড বালা ও চুড়ি সেট",
    description: "খাঁটি সোনার মতো উজ্জ্বল ও দীর্ঘস্থায়ী রঙের নিশ্চয়তা। আধুনিক ও ট্রেডিশনাল উভয় ড্রেসের সাথে পরিধানযোগ্য।",
    category: { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
    subCategory: { _id: "sc_ring", name: "Rings & Bangles", slug: "rings-bangles" },
    vendor: { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1611591475152-473549605898?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1611591475152-473549605898?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 1650,
    costPrice: 900,
    oldPrice: 2400,
    discountPercentage: 31,
    sku: "JW-BNG-004",
    stock: 30,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 35,
    tags: ["jewelry", "bangles", "gold plated", "churi"],
  },
  {
    _id: "p_j5",
    name: "Royal Pearl & Ruby Statement Pendant Necklace",
    slug: "royal-pearl-ruby-statement-pendant-necklace",
    shortDescription: "অরিজিনাল ফ্রেশওয়াটার পার্ল ও রুবি স্টোনের স্টেটমেন্ট নেকলেস",
    description: "অরিজিনাল পার্ল বিডস ও রুবি স্টোনের রাজকীয় কম্বিনেশন। যেকোনো অভিজাত অনুষ্ঠানে আপনার ব্যক্তিত্বকে ফুটিয়ে তুলবে।",
    category: { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
    subCategory: { _id: "sc_neck", name: "Necklaces & Chokers", slug: "necklaces" },
    vendor: { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 1850,
    costPrice: 980,
    oldPrice: 2800,
    discountPercentage: 34,
    sku: "JW-NCK-005",
    stock: 20,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 22,
    tags: ["jewelry", "necklace", "pearl", "ruby", "pendant"],
  },
  {
    _id: "p_j6",
    name: "Traditional South Indian Matte Gold Jhumka Earrings",
    slug: "traditional-south-indian-matte-gold-jhumka-earrings",
    shortDescription: "ঐতিহ্যবাহী সাউথ ইন্ডিয়ান ম্যাট গোল্ড ফিনিশ ময়ূর ঝুমকা",
    description: "ময়ূর মোটিফের ঐতিহ্যবাহী সাউথ ইন্ডিয়ান ম্যাট গোল্ড ঝুমকা। গর্জিয়াস লুক এবং দীর্ঘস্থায়ী প্রিমিয়াম ফিনিশ।",
    category: { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
    subCategory: { _id: "sc_ear", name: "Earrings & Jhumkas", slug: "earrings" },
    vendor: { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 950,
    costPrice: 480,
    oldPrice: 1450,
    discountPercentage: 34,
    sku: "JW-EAR-006",
    stock: 35,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 31,
    tags: ["jewelry", "earrings", "jhumka", "matte gold"],
  },
  {
    _id: "p_j7",
    name: "Exclusive Diamond-Cut Cubic Zirconia Tennis Bracelet",
    slug: "exclusive-diamond-cut-cz-tennis-bracelet",
    shortDescription: "ঝকঝকে অস্ট্রিয়ান সিজেড ডায়মন্ড-কাট প্রিমিয়াম টেনিস ব্রেসলেট",
    description: "আসল ডায়মন্ডের মতো উজ্জ্বল রিফ্লেকশন দেয় এমন মাইক্রো-সেটিং সিজেড স্টোন খচিত অভিজাত টেনিস ব্রেসলেট। ক্লাসি পার্টি লুকের জন্য অতুলনীয়।",
    category: { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
    subCategory: { _id: "sc_ring", name: "Rings & Bangles", slug: "rings-bangles" },
    vendor: { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1611591475152-473549605898?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1611591475152-473549605898?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 1250,
    costPrice: 620,
    oldPrice: 1800,
    discountPercentage: 30,
    sku: "JW-BRC-007",
    stock: 25,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 27,
    tags: ["jewelry", "bracelet", "diamond", "cz", "tennis bracelet"],
  },
  {
    _id: "p_j8",
    name: "Antique Gold Plated Bridal Tikli & Nose Pin (Nath) Combo",
    slug: "antique-gold-plated-bridal-tikli-nath-combo",
    shortDescription: "ট্রেডিশনাল ব্রাইডাল মাংটিকলি এবং চেইনযুক্ত নথ কম্বো প্যাক",
    description: "বিয়ের সাজে পরিপূর্ণতা আনতে ঐতিহ্যবাহী কুন্দন ও মুক্তার কারুকার্য করা টিকলি ও নথ। অত্যন্ত হালকা ও ব্যবহারে অত্যন্ত আরামদায়ক।",
    category: { _id: "c_jwy", name: "জুয়েলারি ও অলংকার", slug: "jewelry" },
    subCategory: { _id: "sc_neck", name: "Necklaces & Chokers", slug: "necklaces" },
    vendor: { _id: "v_or", shopName: "Old Rank Jewelry", slug: "old-rank", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 750,
    costPrice: 360,
    oldPrice: 1100,
    discountPercentage: 31,
    sku: "JW-TIK-008",
    stock: 45,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 19,
    tags: ["jewelry", "tikli", "nath", "bridal"],
  },
];

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
    const { category, search, isHotDeal } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter: any = { isActive: true };

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
        .sort({ createdAt: -1 })
        .limit(100);

      if (products && products.length > 0) {
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
    }

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

    if (mongoose.connection.readyState === 1) {
      const dbProduct = await Product.findOne({ slug })
        .populate("category", "name slug icon image")
        .populate("vendor", "shopName slug logo rating isVerified");

      if (dbProduct) {
        const relatedProducts = await Product.find({ slug: { $ne: slug }, isActive: true })
          .populate("category", "name slug icon image")
          .populate("vendor", "shopName slug logo rating isVerified")
          .limit(4);

        res.json({
          success: true,
          data: {
            product: dbProduct,
            relatedProducts,
          },
        });
        return;
      }
    }

    const product = fallbackProducts.find((p) => p.slug === slug) || fallbackProducts[0];
    const relatedProducts = fallbackProducts.filter((p) => p.slug !== product.slug).slice(0, 4);

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    res.json({
      success: true,
      data: {
        product: fallbackProducts[0],
        relatedProducts: fallbackProducts.slice(1, 5),
      },
    });
  }
};

export const getQuickView = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
      const product = await Product.findOne(query)
        .populate("category", "name slug icon image")
        .populate("vendor", "shopName slug logo rating isVerified");
      if (product) {
        res.json({ success: true, data: product });
        return;
      }
    }

    const product = fallbackProducts.find((p) => p._id === id || p.slug === id) || fallbackProducts[0];
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.json({ success: true, data: fallbackProducts[0] });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
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

    res.json({
      success: true,
      message: "প্রোডাক্ট মুছে ফেলা হয়েছে!",
      id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
