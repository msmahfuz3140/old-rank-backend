import mongoose from "mongoose";
import { Category } from "../models/Category";
import { Vendor } from "../models/Vendor";
import { Product } from "../models/Product";
import { DeliveryZone } from "../models/DeliveryZone";
import { Coupon } from "../models/Coupon";

export const seedIfEmpty = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) return;

  try {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log(`📦 MongoDB already contains ${productCount} products. Skipping initial seed.`);
      return;
    }

    console.log("🌱 MongoDB database is empty. Running automatic seed for Old Rank store...");

    // 1. Categories
    const electronics = await Category.findOneAndUpdate(
      { slug: "electronics" },
      { name: "Electronics & Gadgets", slug: "electronics", icon: "Cpu", level: 1 },
      { upsert: true, new: true }
    );

    const fashion = await Category.findOneAndUpdate(
      { slug: "fashion" },
      { name: "Men's Fashion", slug: "fashion", icon: "Shirt", level: 1 },
      { upsert: true, new: true }
    );

    const womensFashion = await Category.findOneAndUpdate(
      { slug: "womens-fashion" },
      { name: "Women's Fashion", slug: "womens-fashion", icon: "Sparkles", level: 1 },
      { upsert: true, new: true }
    );

    const babyKids = await Category.findOneAndUpdate(
      { slug: "baby-kids" },
      { name: "Baby & Kids", slug: "baby-kids", icon: "Smile", level: 1 },
      { upsert: true, new: true }
    );

    const homeAppliances = await Category.findOneAndUpdate(
      { slug: "home-appliances" },
      { name: "Home & Kitchen Electric", slug: "home-appliances", icon: "Zap", level: 1 },
      { upsert: true, new: true }
    );

    const beautyCosmetics = await Category.findOneAndUpdate(
      { slug: "beauty-cosmetics" },
      { name: "Beauty & Cosmetics", slug: "beauty-cosmetics", icon: "Heart", level: 1 },
      { upsert: true, new: true }
    );

    const smartWatch = await Category.findOneAndUpdate(
      { slug: "smart-watch" },
      { name: "Smart Watch", slug: "smart-watch", icon: "Watch", level: 1 },
      { upsert: true, new: true }
    );

    const digitalItems = await Category.findOneAndUpdate(
      { slug: "digital-items" },
      { name: "Digital Items", slug: "digital-items", icon: "Sparkles", level: 1 },
      { upsert: true, new: true }
    );

    // 2. Vendors
    const oldRankVendor = await Vendor.findOneAndUpdate(
      { slug: "old-rank" },
      {
        shopName: "Old Rank Official Store",
        slug: "old-rank",
        logo: "/images/logo.png",
        banner: "/images/old-rank-banner.jpg",
        rating: 5.0,
        reviewCount: 380,
        isVerified: true,
        totalProducts: 50,
        phone: "01956016119",
        address: "Dhaka, Bangladesh",
        description: "Official Old Rank clothing line & premium lifestyle store.",
      },
      { upsert: true, new: true }
    );

    const gadgetKing = await Vendor.findOneAndUpdate(
      { slug: "gadget-king" },
      {
        shopName: "Gadget King BD",
        slug: "gadget-king",
        rating: 4.9,
        reviewCount: 110,
        isVerified: true,
        totalProducts: 25,
        phone: "01301010553",
        address: "Multiplan Center, Dhaka",
      },
      { upsert: true, new: true }
    );

    // 3. Delivery Zones
    await DeliveryZone.create([
      { name: "ঢাকা সিটির ভেতরে (Inside Dhaka)", slug: "dhaka-inside", charge: 60, estimatedDays: "24-48 Hours", isActive: true },
      { name: "ঢাকা সিটির আশেপাশে (Sub-Dhaka / Gazipur / Narayanganj)", slug: "dhaka-sub", charge: 100, estimatedDays: "2-3 Days", isActive: true },
      { name: "সারা বাংলাদেশ (Outside Dhaka)", slug: "all-bangladesh", charge: 120, estimatedDays: "3-5 Days", isActive: true },
    ]);

    // 4. Coupon
    await Coupon.create({
      code: "SAVE10",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 1000,
      maxDiscount: 500,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000),
    });

    // 5. Products
    const productsData = [
      {
        name: "Old Rank Signature Premium Heavyweight Drop-Shoulder T-Shirt (ওল্ড র‍্যাংক প্রিমিয়াম টি-শার্ট)",
        slug: "old-rank-signature-heavyweight-drop-shoulder-tshirt",
        shortDescription: "240 GSM 100% Combed Compact Cotton, High Density HD Chest Print & Premium Streetwear Fit",
        description: "Our flagship signature drop-shoulder t-shirt crafted from 240 GSM 100% combed compact cotton. Bio-washed, silicone softened, and finished with signature Old Rank high-density silicone chest crest. Built for durability and ultimate street comfort.",
        category: fashion._id,
        vendor: oldRankVendor._id,
        mainImage: "/images/old-rank-banner.jpg",
        galleryImages: ["/images/old-rank-banner.jpg", "/images/logo.png"],
        basePrice: 990,
        oldPrice: 1350,
        discountPercentage: 27,
        sku: "OR-TSHIRT-01",
        stock: 50,
        isHotDeal: true,
        isFeatured: true,
        rating: 5.0,
        reviewCount: 48,
        tags: ["old-rank", "tshirt", "fashion", "cotton", "clothing"],
      },
      {
        name: "Old Rank Limited Edition Embroidered Winter Fleece Hoodie (উইন্টার ফ্লিস হুডি)",
        slug: "old-rank-limited-edition-embroidered-winter-hoodie",
        shortDescription: "340 GSM Brushed Heavy Fleece, High-Density Kangaroo Pocket & Metal Aglet Drawstrings",
        description: "Stay warm in style with the Old Rank limited edition winter hoodie. Tailored from 340 GSM brushed heavy cotton fleece.",
        category: fashion._id,
        vendor: oldRankVendor._id,
        mainImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
        galleryImages: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
        basePrice: 1650,
        oldPrice: 2200,
        discountPercentage: 25,
        sku: "OR-HOODIE-02",
        stock: 35,
        isHotDeal: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 32,
        tags: ["old-rank", "hoodie", "winter", "fashion"],
      },
      {
        name: "Intel Core i5 Desktop Computer Full Setup Gaming PC",
        slug: "intel-core-i5-desktop-computer-full-setup",
        shortDescription: "Customizable 16GB RAM, 512GB NVMe SSD, 1TB HDD & 24 Inch IPS Frameless Monitor",
        description: "Experience ultra-fast computing and gaming with Intel Core i5 processor. Features high-speed DDR4 RAM, lightning fast M.2 NVMe SSD, and 3 Years official warranty.",
        category: electronics._id,
        vendor: gadgetKing._id,
        mainImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
        galleryImages: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80"],
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
        name: "Active Noise Cancelling (ANC) Wireless Bluetooth Earbuds Pro",
        slug: "active-noise-cancelling-wireless-earbuds-pro",
        shortDescription: "35dB Active Noise Cancellation, 40H Battery Life, Deep Bass & Fast Wireless Charging",
        description: "Premium sound clarity with 35dB active noise cancelling, ENC quad microphone, and IPX5 water resistance.",
        category: electronics._id,
        vendor: gadgetKing._id,
        mainImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        galleryImages: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"],
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
        name: "Exclusive Traditional Handwoven Silk Jamdani Saree (হাতে বোনা জামদানি শাড়ি)",
        slug: "exclusive-traditional-handwoven-silk-jamdani-saree",
        shortDescription: "Pure Resham Silk with Elegant Golden Zari Weaving & Matching Blouse Piece",
        description: "Finely hand-woven Dhakai Jamdani saree made by master artisans of Narayanganj. Features pure resham silk warp and weft with intricate golden zari floral motifs.",
        category: womensFashion._id,
        vendor: oldRankVendor._id,
        mainImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        galleryImages: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"],
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
        name: "Digital Touchscreen 6L Oil-Free Healthy Electric Air Fryer (স্মার্ট ইলেকট্রিক এয়ার ফ্রায়ার)",
        slug: "digital-touchscreen-6l-oil-free-electric-air-fryer",
        shortDescription: "1800W 360° Rapid Air Circulation, 8 Preset Cooking Menus & Non-Stick Basket",
        description: "Enjoy crispy french fries, roasted chicken, and baked snacks with 85% less oil. Features one-touch digital LED panel.",
        category: homeAppliances._id,
        vendor: gadgetKing._id,
        mainImage: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80",
        galleryImages: ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80"],
        basePrice: 5450,
        oldPrice: 7200,
        discountPercentage: 24,
        sku: "AF-DIG-6L",
        stock: 25,
        isHotDeal: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 95,
        tags: ["air fryer", "kitchen", "electric", "appliances"],
      },
    ];

    await Product.create(productsData);
    console.log("🎉 MongoDB Auto-Seeding complete: All products, categories, and vendors are now saved in MongoDB!");
  } catch (error) {
    console.warn("MongoDB Auto-seed encountered an issue:", error);
  }
};
