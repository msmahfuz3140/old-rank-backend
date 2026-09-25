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

    console.log("🌱 MongoDB database is empty. Running automatic seed for Old Rank Jewelry Store...");

    // 1. Categories (Jewelry Active, Others Coming Soon)
    const jewelry = await Category.findOneAndUpdate(
      { slug: "jewelry" },
      {
        name: "জুয়েলারি ও অলংকার",
        slug: "jewelry",
        icon: "Gem",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80",
        level: 1,
        isComingSoon: false,
        isActive: true,
        subcategories: [
          { name: "Necklaces & Chokers", slug: "necklaces", level: 2 },
          { name: "Earrings & Jhumkas", slug: "earrings", level: 2 },
          { name: "Rings & Bangles", slug: "rings-bangles", level: 2 },
        ],
      },
      { upsert: true, new: true }
    );

    const womensFashion = await Category.findOneAndUpdate(
      { slug: "womens-fashion" },
      {
        name: "Women's Fashion",
        slug: "womens-fashion",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80",
        level: 1,
        isComingSoon: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const fashion = await Category.findOneAndUpdate(
      { slug: "fashion" },
      {
        name: "Men's Fashion",
        slug: "fashion",
        icon: "Shirt",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60",
        level: 1,
        isComingSoon: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const electronics = await Category.findOneAndUpdate(
      { slug: "electronics" },
      {
        name: "Electronics & Gadgets",
        slug: "electronics",
        icon: "Cpu",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60",
        level: 1,
        isComingSoon: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const babyKids = await Category.findOneAndUpdate(
      { slug: "baby-kids" },
      {
        name: "Baby & Kids",
        slug: "baby-kids",
        icon: "Smile",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=60",
        level: 1,
        isComingSoon: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const homeAppliances = await Category.findOneAndUpdate(
      { slug: "home-appliances" },
      {
        name: "Home & Kitchen Electric",
        slug: "home-appliances",
        icon: "Zap",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60",
        level: 1,
        isComingSoon: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const beautyCosmetics = await Category.findOneAndUpdate(
      { slug: "beauty-cosmetics" },
      {
        name: "Beauty & Cosmetics",
        slug: "beauty-cosmetics",
        icon: "Heart",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60",
        level: 1,
        isComingSoon: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const smartWatch = await Category.findOneAndUpdate(
      { slug: "smart-watch" },
      {
        name: "Smart Watch",
        slug: "smart-watch",
        icon: "Watch",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
        level: 1,
        isComingSoon: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    // 2. Official Vendor
    const oldRankVendor = await Vendor.findOneAndUpdate(
      { slug: "old-rank" },
      {
        shopName: "Old Rank Jewelry Official Store",
        slug: "old-rank",
        logo: "/images/logo.png",
        banner: "/images/old-rank-banner.jpg",
        rating: 5.0,
        reviewCount: 380,
        isVerified: true,
        totalProducts: 8,
        phone: "01956016119",
        address: "Dhaka, Bangladesh",
        description: "Official Old Rank premium jewelry line & exclusive royal ornaments.",
      },
      { upsert: true, new: true }
    );

    // 3. Delivery Zones
    await DeliveryZone.deleteMany({});
    await DeliveryZone.create([
      { division: "Dhaka", district: "ঢাকা সিটি (Inside Dhaka)", deliveryCharge: 60, estimatedDelivery: "24-48 Hours", isActive: true },
      { division: "Dhaka", district: "ঢাকা সাব-এরিয়া (Sub-Dhaka / Gazipur / Narayanganj)", deliveryCharge: 100, estimatedDelivery: "2-3 Days", isActive: true },
      { division: "All", district: "সারা বাংলাদেশ (Outside Dhaka)", deliveryCharge: 120, estimatedDelivery: "3-5 Days", isActive: true },
    ]);

    // 4. Coupon
    await Coupon.findOneAndUpdate(
      { code: "SAVE10" },
      {
        code: "SAVE10",
        discountType: "percentage",
        discountAmount: 10,
        minSpend: 1000,
        maxDiscount: 500,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000),
      },
      { upsert: true, new: true }
    );

    // 5. Products (8 Exclusive Jewelry Items with costPrice)
    const productsData = [
      {
        name: "Traditional 22K Gold Plated Bridal Choker Necklace Set",
        slug: "traditional-22k-gold-plated-bridal-necklace-set",
        shortDescription: "এক্সক্লুসিভ ব্রাইডাল কুন্দন ও পার্ল ডিজাইনের প্রিমিয়াম গোল্ড প্লেটেড নেকলেস সেট",
        description: "অসাধারণ কারুকার্যমণ্ডিত প্রিমিয়াম কোয়ালিটি কুন্দন ও পার্ল ডিজাইনের এই নেকলেস সেটটি আপনার বিশেষ দিনের সৌন্দর্য বহুগুণ বাড়িয়ে তুলবে। সাথে পাচ্ছেন মানানসই ম্যাচিং ঝুমকা কানের দুল ও টিকলি। দীর্ঘস্থায়ী গোল্ড পলিশ গ্যারান্টি।",
        category: jewelry._id,
        vendor: oldRankVendor._id,
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
        name: "Crystal Emerald Green Stone Royal Party Earrings",
        slug: "crystal-emerald-green-royal-party-earrings",
        shortDescription: "রয়েল এমারেল্ড গ্রিন ক্রিস্টাল ড্রপলেট স্টোনের লাক্সারি পার্টি ইয়াররিংস",
        description: "উচ্চমানের অস্ট্রিয়ান ক্রিস্টাল ও এমারেল্ড গ্রিন জেমস্টোনে তৈরি রাজকীয় ডিজাইনের কানের দুল। হালকা ওজনে পরতে আরামদায়ক এবং যেকোনো পার্টি বা বিয়ের অনুষ্ঠানে নজরকাড়া লুক দেবে।",
        category: jewelry._id,
        vendor: oldRankVendor._id,
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
        name: "Handcrafted Antique Kundan Floral Finger Ring",
        slug: "handcrafted-antique-kundan-floral-finger-ring",
        shortDescription: "হাতে তৈরি এন্টিক ফ্লোরাল কুন্দন এডজাস্টেবল আংটি",
        description: "যেকোনো আঙুলের সাইজের জন্য পারফেক্ট এডজাস্টেবল সাইজ। রয়্যাল এন্টিক ফিনিশ ও কুন্দন স্টোনের নিপুণ কারুকাজ।",
        category: jewelry._id,
        vendor: oldRankVendor._id,
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
        name: "Classic 24K Micron Gold Plated Textured Bangles (Pair)",
        slug: "classic-24k-micron-gold-plated-textured-bangles-pair",
        shortDescription: "২ জোড়া প্রিমিয়াম গোল্ড পলিশ টেক্সচার্ড বালা ও চুড়ি সেট",
        description: "খাঁটি সোনার মতো উজ্জ্বল ও দীর্ঘস্থায়ী রঙের নিশ্চয়তা। আধুনিক ও ট্রেডিশনাল উভয় ড্রেসের সাথে পরিধানযোগ্য।",
        category: jewelry._id,
        vendor: oldRankVendor._id,
        mainImage: "https://images.unsplash.com/photo-1611591475152-473549605898?w=800&auto=format&fit=crop&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1611591475152-473549605898?w=800&auto=format&fit=crop&q=80",
        ],
        basePrice: 1450,
        costPrice: 750,
        oldPrice: 2100,
        discountPercentage: 31,
        sku: "JW-BNG-004",
        stock: 30,
        isHotDeal: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 35,
        tags: ["jewelry", "bangles", "gold plated", "traditional"],
      },
      {
        name: "Royal Ruby Red Zirconia Multi-Layer Pearl Necklace Set",
        slug: "royal-ruby-red-multi-layer-pearl-necklace-set",
        shortDescription: "রয়েল রুবি রেড জিরকন ও মাল্টি-লেয়ার মুক্তার রাজকীয় নেকলেস সেট",
        description: "অভিজাত রুবি রেড জিরকন পেন্ডেন্ট ও প্রাকৃতিক চকচকে মুক্তার মাল্টি-লেয়ার হার। সাথে রয়েছে মানানসই গর্জিয়াস ইয়াররিংস।",
        category: jewelry._id,
        vendor: oldRankVendor._id,
        mainImage: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80",
        ],
        basePrice: 2850,
        costPrice: 1550,
        oldPrice: 3900,
        discountPercentage: 27,
        sku: "JW-NCK-005",
        stock: 20,
        isHotDeal: true,
        isFeatured: true,
        rating: 5.0,
        reviewCount: 47,
        tags: ["jewelry", "necklace", "pearl", "ruby", "bridal set"],
      },
      {
        name: "Matte Gold Traditional Temple Jhumka Earrings",
        slug: "matte-gold-traditional-temple-jhumka-earrings",
        shortDescription: "ম্যাট গোল্ড ফিনিশিং ট্রেডিশনাল টেম্পল ঝুমকা কানের দুল",
        description: "দক্ষিণ ভারতীয় টেম্পল আর্ট ডিজাইনে তৈরি অত্যন্ত সুদৃশ্য বড় ঝুমকা। নিখুঁত ফিনিশ ও উৎসবের সাজের জন্য শ্রেষ্ঠ পছন্দ।",
        category: jewelry._id,
        vendor: oldRankVendor._id,
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
        name: "Exclusive Diamond-Cut Cubic Zirconia Tennis Bracelet",
        slug: "exclusive-diamond-cut-cz-tennis-bracelet",
        shortDescription: "ঝকঝকে অস্ট্রিয়ান সিজেড ডায়মন্ড-কাট প্রিমিয়াম টেনিস ব্রেসলেট",
        description: "আসল ডায়মন্ডের মতো উজ্জ্বল রিফ্লেকশন দেয় এমন মাইক্রো-সেটিং সিজেড স্টোন খচিত অভিজাত টেনিস ব্রেসলেট। ক্লাসি পার্টি লুকের জন্য অতুলনীয়।",
        category: jewelry._id,
        vendor: oldRankVendor._id,
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
        name: "Antique Gold Plated Bridal Tikli & Nose Pin (Nath) Combo",
        slug: "antique-gold-plated-bridal-tikli-nath-combo",
        shortDescription: "ট্রেডিশনাল ব্রাইডাল মাংটিকলি এবং চেইনযুক্ত নথ কম্বো প্যাক",
        description: "বিয়ের সাজে পরিপূর্ণতা আনতে ঐতিহ্যবাহী কুন্দন ও মুক্তার কারুকার্য করা টিকলি ও নথ। অত্যন্ত হালকা ও ব্যবহারে অত্যন্ত আরামদায়ক।",
        category: jewelry._id,
        vendor: oldRankVendor._id,
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

    await Product.create(productsData);
    console.log("🎉 MongoDB Auto-Seeding complete: All jewelry products, categories, and settings are now saved in MongoDB!");
  } catch (error) {
    console.warn("MongoDB Auto-seed encountered an issue:", error);
  }
};
