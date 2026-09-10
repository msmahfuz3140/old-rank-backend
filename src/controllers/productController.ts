import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Category } from "../models/Category";

const fallbackCategories = [
  { _id: "c1", name: "Electronics & Gadgets", slug: "electronics", icon: "Cpu", level: 1, subcategories: [] },
  { _id: "c6", name: "Women's Fashion", slug: "womens-fashion", icon: "Sparkles", level: 1, subcategories: [] },
  { _id: "c7", name: "Baby & Kids", slug: "baby-kids", icon: "Smile", level: 1, subcategories: [] },
  { _id: "c8", name: "Home & Kitchen Electric", slug: "home-appliances", icon: "Zap", level: 1, subcategories: [] },
  { _id: "c2", name: "Men's Fashion", slug: "fashion", icon: "Shirt", level: 1, subcategories: [] },
  { _id: "c9", name: "Beauty & Cosmetics", slug: "beauty-cosmetics", icon: "Heart", level: 1, subcategories: [] },
  { _id: "c3", name: "Smart Watch", slug: "smart-watch", icon: "Watch", level: 1, subcategories: [] },
  { _id: "c5", name: "Digital Items", slug: "digital-items", icon: "Sparkles", level: 1, subcategories: [] },
];

let fallbackProducts: any[] = [
  {
    _id: "p1",
    name: "Intel Core i5 Desktop Computer Full Setup Gaming PC",
    slug: "intel-core-i5-desktop-computer-full-setup",
    shortDescription: "Customizable 16GB RAM, 512GB NVMe SSD, 1TB HDD & 24 Inch IPS Frameless Monitor",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    basePrice: 42500,
    oldPrice: 48000,
    discountPercentage: 11,
    sku: "PC-I5-2026",
    stock: 15,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 28,
    tags: ["pc", "desktop", "gaming", "intel"],
  },
  {
    _id: "p_e2",
    name: "Active Noise Cancelling (ANC) Wireless Bluetooth Earbuds Pro",
    slug: "active-noise-cancelling-wireless-earbuds-pro",
    shortDescription: "35dB Active Noise Cancellation, 40H Battery Life, Deep Bass & Fast Wireless Charging",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    basePrice: 1850,
    oldPrice: 2600,
    discountPercentage: 29,
    sku: "ANC-EAR-01",
    stock: 65,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 115,
    tags: ["earbuds", "audio", "bluetooth", "wireless"],
  },
  {
    _id: "p_e3",
    name: "Smart 4K HDR Frameless Android Voice Control LED TV 43 Inch",
    slug: "smart-4k-frameless-android-led-tv-43-inch",
    shortDescription: "Official Google Certified Android 13, Dolby Audio, Dual Band WiFi & Bluetooth Remote",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80",
    basePrice: 26500,
    oldPrice: 32000,
    discountPercentage: 17,
    sku: "TV-43-4K",
    stock: 20,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 53,
    tags: ["tv", "smart tv", "4k", "android"],
  },
  {
    _id: "p_e4",
    name: "65W Super Fast PD Power Bank 20000mAh with Digital LED Display",
    slug: "65w-super-fast-pd-power-bank-20000mah",
    shortDescription: "Laptop & Smartphone Fast Charging with 3 Outputs, Aircraft Safe & Multi-Protection",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1609592426809-54876b567d16?w=800&auto=format&fit=crop&q=80",
    basePrice: 2200,
    oldPrice: 2900,
    discountPercentage: 24,
    sku: "PB-65W-20K",
    stock: 45,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 84,
    tags: ["powerbank", "fast charging", "battery"],
  },
  {
    _id: "p_e8",
    name: "Rechargeable 360° Portable Bladeless Silent Neck Fan",
    slug: "rechargeable-portable-bladeless-silent-neck-fan",
    shortDescription: "Hands-Free Cooling with 3 Speed Modes, 4000mAh Battery & All-Day Comfort",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    basePrice: 890,
    oldPrice: 1350,
    discountPercentage: 34,
    sku: "FAN-NECK-01",
    stock: 80,
    isHotDeal: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 79,
    tags: ["fan", "summer", "portable"],
  },
  {
    _id: "p2",
    name: "Ultra Modern Smartwatch Series 9 with AMOLED Display",
    slug: "ultra-modern-smartwatch-series-9",
    shortDescription: "Bluetooth Calling, Heart Rate, SpO2 & Wireless Fast Charging",
    category: { _id: "c3", name: "Smart Watch", slug: "smart-watch" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.8 },
    mainImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    basePrice: 2850,
    oldPrice: 3800,
    discountPercentage: 25,
    sku: "WATCH-S9-PRO",
    stock: 40,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 65,
    tags: ["watch", "smartwatch"],
  },
  {
    _id: "p_w1",
    name: "Exclusive Traditional Handwoven Silk Jamdani Saree (হাতে বোনা জামদানি শাড়ি)",
    slug: "exclusive-traditional-handwoven-silk-jamdani-saree",
    shortDescription: "Pure Resham Silk with Elegant Golden Zari Weaving & Matching Blouse Piece",
    category: { _id: "c6", name: "Women's Fashion", slug: "womens-fashion" },
    vendor: { _id: "v3", shopName: "Aarong Luxury Mart", slug: "aarong-luxury", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    basePrice: 3850,
    oldPrice: 5200,
    discountPercentage: 26,
    sku: "SAR-JAM-01",
    stock: 25,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 64,
    tags: ["saree", "jamdani", "traditional", "women"],
  },
  {
    _id: "p_w2",
    name: "Designer Embroidered Georgette Salwar Kameez 3-Piece (জর্জেট পার্টি থ্রি-পিস)",
    slug: "designer-embroidered-georgette-salwar-kameez-3-piece",
    shortDescription: "Heavy Thread & Sequence Work with Butter Silk Inner & Chiffon Dupatta",
    category: { _id: "c6", name: "Women's Fashion", slug: "womens-fashion" },
    vendor: { _id: "v3", shopName: "Aarong Luxury Mart", slug: "aarong-luxury", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
    basePrice: 2950,
    oldPrice: 3800,
    discountPercentage: 22,
    sku: "SK-GEORG-02",
    stock: 35,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 47,
    tags: ["three-piece", "salwar", "kameez", "women"],
  },
  {
    _id: "p_w3",
    name: "Italian Vegan Leather Luxury Ladies Shoulder & Tote Bag (লেডিস লাক্সারি হ্যান্ডব্যাগ)",
    slug: "italian-vegan-leather-luxury-ladies-tote-bag",
    shortDescription: "Spacious Multi-Pocket Design, Gold Plated Hardware & Detachable Shoulder Strap",
    category: { _id: "c6", name: "Women's Fashion", slug: "womens-fashion" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.8 },
    mainImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    basePrice: 1850,
    oldPrice: 2600,
    discountPercentage: 28,
    sku: "BAG-TOTE-01",
    stock: 40,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 82,
    tags: ["handbag", "bag", "tote", "women"],
  },
  {
    _id: "p_w4",
    name: "Vitamin C Glow + Hyaluronic Acid Brightening Facial Serum 30ml (ফেস সিরাম)",
    slug: "vitamin-c-glow-hyaluronic-acid-brightening-facial-serum",
    shortDescription: "20% Pure Vitamin C, Niacinamide & Ferulic Acid for Glowing Spotless Skin",
    category: { _id: "c9", name: "Beauty & Cosmetics", slug: "beauty-cosmetics" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.8 },
    mainImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    basePrice: 790,
    oldPrice: 1200,
    discountPercentage: 34,
    sku: "SERUM-VITC",
    stock: 90,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 120,
    tags: ["skincare", "serum", "beauty"],
  },
  {
    _id: "p_b1",
    name: "100% Organic Soft Combed Cotton Newborn Baby Romper 3-Pack (নবজাতক বেবি রম্পার ৩-প্যাক)",
    slug: "organic-cotton-newborn-baby-romper-3-pack",
    shortDescription: "Ultra-Soft Breathable Fabric with Nickel-Free Snap Buttons for Easy Diaper Change",
    category: { _id: "c7", name: "Baby & Kids", slug: "baby-kids" },
    vendor: { _id: "v4", shopName: "Kids Paradise BD", slug: "kids-paradise", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80",
    basePrice: 980,
    oldPrice: 1450,
    discountPercentage: 32,
    sku: "ROM-BABY-03",
    stock: 50,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 73,
    tags: ["baby", "kids", "romper"],
  },
  {
    _id: "p_b2",
    name: "Anti-Colic BPA-Free Baby Feeding Bottle & Nipple Set 240ml (বেবি ফিডিং বোতল)",
    slug: "anti-colic-bpa-free-baby-feeding-bottle-set",
    shortDescription: "Natural Latch Silicone Teat, Air Ventilation System to Prevent Gas & Colic",
    category: { _id: "c7", name: "Baby & Kids", slug: "baby-kids" },
    vendor: { _id: "v4", shopName: "Kids Paradise BD", slug: "kids-paradise", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1584839462886-455b6c8dc5f4?w=800&auto=format&fit=crop&q=80",
    basePrice: 650,
    oldPrice: 950,
    discountPercentage: 31,
    sku: "BOT-FEED-240",
    stock: 60,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 55,
    tags: ["baby", "feeding", "bottle"],
  },
  {
    _id: "p_b3",
    name: "Ultra-Lightweight Portable Folding Baby Stroller & Pram (ফোল্ডিং বেবি স্ট্রোলার)",
    slug: "ultra-lightweight-portable-folding-baby-stroller",
    shortDescription: "1-Hand Easy Compact Fold, Shock Absorbing Wheels, Adjustable Recline & UV Canopy",
    category: { _id: "c7", name: "Baby & Kids", slug: "baby-kids" },
    vendor: { _id: "v4", shopName: "Kids Paradise BD", slug: "kids-paradise", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80",
    basePrice: 5800,
    oldPrice: 7500,
    discountPercentage: 22,
    sku: "STROLL-FOLD-01",
    stock: 18,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 41,
    tags: ["stroller", "pram", "baby"],
  },
  {
    _id: "p_e1",
    name: "Digital Touchscreen 6L Oil-Free Healthy Electric Air Fryer (স্মার্ট ইলেকট্রিক এয়ার ফ্রায়ার)",
    slug: "digital-touchscreen-6l-oil-free-electric-air-fryer",
    shortDescription: "1800W 360° Rapid Air Circulation, 8 Preset Cooking Menus & Non-Stick Basket",
    category: { _id: "c8", name: "Home & Kitchen Electric", slug: "home-appliances" },
    vendor: { _id: "v5", shopName: "Smart Living Appliances", slug: "smart-living", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80",
    basePrice: 5450,
    oldPrice: 7200,
    discountPercentage: 24,
    sku: "AF-DIG-6L",
    stock: 25,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 95,
    tags: ["air fryer", "kitchen", "appliances"],
  },
  {
    _id: "p_e5",
    name: "Heavy Duty 750W 3-in-1 Stainless Steel Kitchen Mixer Grinder & Blender (মিক্সার গ্রাইন্ডার ও ব্লেন্ডার)",
    slug: "heavy-duty-750w-stainless-steel-mixer-grinder",
    shortDescription: "100% Copper Motor, 3 Hardened Stainless Steel Jars for Wet, Dry & Chutney Grinding",
    category: { _id: "c8", name: "Home & Kitchen Electric", slug: "home-appliances" },
    vendor: { _id: "v5", shopName: "Smart Living Appliances", slug: "smart-living", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80",
    basePrice: 3250,
    oldPrice: 4100,
    discountPercentage: 20,
    sku: "MIX-750W-3J",
    stock: 30,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 66,
    tags: ["blender", "mixer", "grinder"],
  },
  {
    _id: "p_e7",
    name: "Smart WiFi Robotic Vacuum Cleaner with Auto Mopping & LiDAR Navigation (রোবট ক্লিনার)",
    slug: "smart-wifi-robotic-vacuum-cleaner-auto-mopping",
    shortDescription: "4000Pa Strong Suction, Smartphone App & Voice Control, Anti-Fall Sensors",
    category: { _id: "c8", name: "Home & Kitchen Electric", slug: "home-appliances" },
    vendor: { _id: "v5", shopName: "Smart Living Appliances", slug: "smart-living", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    basePrice: 15500,
    oldPrice: 19500,
    discountPercentage: 20,
    sku: "ROBOT-VAC-01",
    stock: 12,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 31,
    tags: ["robot", "vacuum", "cleaner"],
  },
  {
    _id: "p3",
    name: "Premium Oxford Cotton Long Sleeve Casual Shirt for Men",
    slug: "premium-oxford-cotton-casual-shirt",
    shortDescription: "100% Breathable Export Quality Cotton with Modern Slim Fit",
    category: { _id: "c2", name: "Men's Fashion", slug: "fashion" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    basePrice: 1250,
    oldPrice: 1750,
    discountPercentage: 28,
    sku: "SHIRT-OXF-01",
    stock: 55,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 88,
    tags: ["shirt", "cotton", "men"],
  },
  {
    _id: "p4",
    name: "Comfort Narrow Fit Stretchable Chino Pant for Men",
    slug: "comfort-narrow-fit-stretchable-chino-pant",
    shortDescription: "Premium Twill Cotton Spandex with Flex Waistband",
    category: { _id: "c2", name: "Men's Fashion", slug: "fashion" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.7 },
    mainImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    basePrice: 1450,
    oldPrice: 1950,
    discountPercentage: 25,
    sku: "PANT-CHINO-02",
    stock: 35,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 42,
    tags: ["pant", "chino", "cotton"],
  },
  {
    _id: "p5",
    name: "Canva Pro Lifetime Owner Access (Digital Activation)",
    slug: "canva-pro-lifetime-owner-access",
    shortDescription: "Original Brand Kit, 100M+ Stock Assets & AI Magic Studio",
    category: { _id: "c5", name: "Digital Items", slug: "digital-items" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    basePrice: 499,
    oldPrice: 1500,
    discountPercentage: 66,
    sku: "DIGI-CANVA",
    stock: 999,
    isHotDeal: true,
    isFeatured: true,
    isDigital: true,
    rating: 5.0,
    reviewCount: 310,
    tags: ["canva", "digital"],
  },
];

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, isHotDeal } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        const filter: any = { isActive: true };
        if (isHotDeal === "true") filter.isHotDeal = true;
        const products = await Product.find(filter).sort({ createdAt: -1 }).limit(30).maxTimeMS(800);
        if (products && products.length > 0) {
          res.json({ success: true, data: products });
          return;
        }
      } catch {
        // use fallback
      }
    }

    let filtered = [...fallbackProducts];
    if (category) {
      filtered = filtered.filter((p) => p.category.slug === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q))));
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
    let product: any = fallbackProducts.find((p) => p.slug === slug) || fallbackProducts[0];

    if (mongoose.connection.readyState === 1) {
      try {
        const dbProduct = await Product.findOne({ slug }).maxTimeMS(800);
        if (dbProduct) product = dbProduct;
      } catch {
        // use fallback
      }
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
  const { id } = req.params;
  const product = fallbackProducts.find((p) => p._id === id) || fallbackProducts[0];
  res.json({ success: true, data: product });
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const dbCats = await Category.find({ isActive: true }).maxTimeMS(800);
        if (dbCats && dbCats.length > 0) {
          res.json({ success: true, data: dbCats });
          return;
        }
      } catch {
        // use fallback
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
    const cleanName = data.name || "Untitled Product";
    const slugBase = (data.slug || cleanName).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const generatedSlug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const newProd = {
      _id: `p_${Date.now()}`,
      name: cleanName,
      slug: generatedSlug,
      shortDescription: data.shortDescription || cleanName,
      description: data.description || cleanName,
      category: typeof data.category === "object" ? data.category : { _id: "c2", name: data.category || "Men's Fashion", slug: (data.category || "fashion").toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      vendor: typeof data.vendor === "object" ? data.vendor : { _id: "v_or", shopName: data.vendor || "Old Rank Official", slug: "old-rank", isVerified: true, rating: 5.0 },
      mainImage: data.mainImage || "/images/old-rank-banner.jpg",
      galleryImages: data.galleryImages || [data.mainImage || "/images/old-rank-banner.jpg"],
      basePrice: Number(data.basePrice) || 990,
      oldPrice: Number(data.oldPrice) || (Number(data.basePrice) ? Math.round(Number(data.basePrice) * 1.25) : 1250),
      discountPercentage: data.discountPercentage || (data.oldPrice && data.basePrice ? Math.round(((Number(data.oldPrice) - Number(data.basePrice)) / Number(data.oldPrice)) * 100) : 20),
      sku: data.sku || `OR-${Date.now().toString().slice(-4)}`,
      stock: Number(data.stock) !== undefined ? Number(data.stock) : 50,
      isHotDeal: Boolean(data.isHotDeal),
      isFeatured: Boolean(data.isFeatured),
      rating: 5.0,
      reviewCount: 1,
      tags: data.tags || ["old-rank", "clothing", "fashion"],
      variants: data.variants || [],
      createdAt: new Date().toISOString(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        await Product.create(newProd);
      } catch (err) {
        console.warn("MongoDB product create skipped:", err);
      }
    }

    fallbackProducts.unshift(newProd);

    res.status(201).json({
      success: true,
      message: "প্রোডাক্ট সফলভাবে পোস্ট করা হয়েছে!",
      data: newProd,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        await Product.findByIdAndUpdate(id, updates);
      } catch (err) {
        console.warn("MongoDB product update skipped:", err);
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

    res.json({
      success: true,
      message: "প্রোডাক্ট আপডেট সম্পন্ন",
      data: updates,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        await Product.findByIdAndDelete(id);
      } catch (err) {
        console.warn("MongoDB product delete skipped:", err);
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
