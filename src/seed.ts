import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Category } from "./models/Category";
import { Vendor } from "./models/Vendor";
import { Product } from "./models/Product";
import { DeliveryZone } from "./models/DeliveryZone";
import { Coupon } from "./models/Coupon";
import { Order } from "./models/Order";

const seedData = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopgenie";
  console.log(`Connecting to ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding.");

    // Clear existing collections
    await Category.deleteMany({});
    await Vendor.deleteMany({});
    await Product.deleteMany({});
    await DeliveryZone.deleteMany({});
    await Coupon.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared existing data.");

    // 1. Seed Categories
    const electronics = await Category.create({
      name: "Electronics",
      slug: "electronics",
      icon: "Cpu",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60",
      level: 1,
    });

    const fashion = await Category.create({
      name: "Fashion",
      slug: "fashion",
      icon: "Shirt",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60",
      level: 1,
    });

    const smartWatch = await Category.create({
      name: "Smart Watch",
      slug: "smart-watch",
      icon: "Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      level: 1,
    });

    const groceries = await Category.create({
      name: "Groceries",
      slug: "groceries",
      icon: "ShoppingBag",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60",
      level: 1,
    });

    const digitalItems = await Category.create({
      name: "Digital Items",
      slug: "digital-items",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
      level: 1,
    });

    // Subcategories
    const laptop = await Category.create({
      name: "Laptop",
      slug: "laptop",
      parentId: electronics._id,
      level: 2,
    });

    const tvMonitor = await Category.create({
      name: "TV & Monitor",
      slug: "tv-monitor",
      parentId: electronics._id,
      level: 2,
    });

    const pant = await Category.create({
      name: "Pant",
      slug: "pant",
      parentId: fashion._id,
      level: 2,
    });

    const shirt = await Category.create({
      name: "Shirt",
      slug: "shirt",
      parentId: fashion._id,
      level: 2,
    });

    console.log("Categories seeded successfully.");

    // 2. Seed Vendors
    const vendorShapno = await Vendor.create({
      shopName: "Shapno Lifestyle",
      slug: "shapno",
      logo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewCount: 142,
      isVerified: true,
      totalProducts: 48,
      phone: "01711223344",
      address: "House 24, Road 7, Dhanmondi, Dhaka",
      description: "Authentic premium fashion and lifestyle products direct from manufacturer.",
    });

    const vendorGadgetKing = await Vendor.create({
      shopName: "Gadget King BD",
      slug: "gadget-king",
      logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80",
      rating: 4.8,
      reviewCount: 98,
      isVerified: true,
      totalProducts: 35,
      phone: "01822334455",
      address: "Shop 402, Multiplan Center, Elephant Road, Dhaka",
      description: "Original electronics, gadgets, and tech accessories with official warranty.",
    });

    console.log("Vendors seeded successfully.");

    // 3. Seed Products
    await Product.create([
      {
        name: "Intel Core i5 Desktop Computer Full Setup Gaming PC",
        slug: "intel-core-i5-desktop-computer-full-setup",
        shortDescription: "Customizable 16GB RAM, 512GB NVMe SSD, 1TB HDD & 24 Inch IPS Frameless Monitor",
        description: "Experience ultra-fast computing and gaming with Intel Core i5 processor. Features high-speed DDR4 RAM, lightning fast M.2 NVMe SSD, dedicated cooling fans, RGB gaming casing, and 3 Years official warranty.",
        category: electronics._id,
        subCategory: tvMonitor._id,
        vendor: vendorGadgetKing._id,
        mainImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80",
        ],
        basePrice: 42500,
        oldPrice: 48000,
        discountPercentage: 11,
        sku: "PC-I5-2026",
        stock: 15,
        isHotDeal: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 28,
        tags: ["pc", "desktop", "gaming", "intel", "computer"],
        variants: [
          { colorName: "Matte Black", colorHex: "#000000", sizeName: "16GB RAM / 512GB SSD", price: 42500, stock: 10, sku: "PC-BLK-16" },
          { colorName: "RGB White", colorHex: "#ffffff", sizeName: "32GB RAM / 1TB SSD", price: 49500, stock: 5, sku: "PC-WHT-32" },
        ],
      },
      {
        name: "Ultra Modern Smartwatch Series 9 with AMOLED Display",
        slug: "ultra-modern-smartwatch-series-9",
        shortDescription: "Bluetooth Calling, Heart Rate, SpO2 & Wireless Fast Charging",
        description: "Premium smartwatch with crisp 2.04 inch AMOLED curved display. Supports dual-mode Bluetooth calling, 100+ sports modes, 7-day battery life, and IP68 waterproof rating.",
        category: smartWatch._id,
        vendor: vendorGadgetKing._id,
        mainImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
        ],
        basePrice: 2850,
        oldPrice: 3800,
        discountPercentage: 25,
        sku: "WATCH-S9-PRO",
        stock: 40,
        isHotDeal: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 65,
        tags: ["watch", "smartwatch", "fitness", "bluetooth calling"],
        variants: [
          { colorName: "Midnight Black", colorHex: "#111827", sizeName: "45mm", price: 2850, stock: 20, sku: "SW-BLK" },
          { colorName: "Starlight Silver", colorHex: "#e5e7eb", sizeName: "45mm", price: 2850, stock: 15, sku: "SW-SLV" },
          { colorName: "Rose Gold", colorHex: "#f43f5e", sizeName: "41mm", price: 2950, stock: 5, sku: "SW-GLD" },
        ],
      },
      {
        name: "Premium Oxford Cotton Long Sleeve Casual Shirt for Men",
        slug: "premium-oxford-cotton-casual-shirt",
        shortDescription: "100% Breathable Export Quality Cotton with Modern Slim Fit",
        description: "Made from 100% combed Oxford cotton. Features button-down collar, wrinkle-free smooth texture, fine stitching, and tailored fit for both office and casual occasions.",
        category: fashion._id,
        subCategory: shirt._id,
        vendor: vendorShapno._id,
        mainImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
        ],
        basePrice: 1250,
        oldPrice: 1750,
        discountPercentage: 28,
        sku: "SHIRT-OXF-01",
        stock: 55,
        isHotDeal: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 88,
        tags: ["shirt", "cotton", "men", "formal", "casual"],
        variants: [
          { colorName: "Navy Blue", colorHex: "#1e3a8a", sizeName: "M", price: 1250, stock: 15, sku: "SH-NAV-M" },
          { colorName: "Navy Blue", colorHex: "#1e3a8a", sizeName: "L", price: 1250, stock: 20, sku: "SH-NAV-L" },
          { colorName: "Sky Blue", colorHex: "#38bdf8", sizeName: "M", price: 1250, stock: 10, sku: "SH-SKY-M" },
          { colorName: "White", colorHex: "#ffffff", sizeName: "L", price: 1250, stock: 10, sku: "SH-WHT-L" },
        ],
        wholesalePrices: [
          { minQuantity: 5, price: 1100 },
          { minQuantity: 10, price: 990 },
        ],
      },
      {
        name: "Comfort Narrow Fit Stretchable Chino Pant for Men",
        slug: "comfort-narrow-fit-stretchable-chino-pant",
        shortDescription: "Premium Twill Cotton Spandex with Flex Waistband",
        description: "Premium twill fabric with 2% elastane for maximum comfort and flexibility. Deep side pockets, reinforced belt loops, and rich color fastness.",
        category: fashion._id,
        subCategory: pant._id,
        vendor: vendorShapno._id,
        mainImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
        galleryImages: [],
        basePrice: 1450,
        oldPrice: 1950,
        discountPercentage: 25,
        sku: "PANT-CHINO-02",
        stock: 35,
        isHotDeal: false,
        isFeatured: true,
        rating: 4.7,
        reviewCount: 42,
        tags: ["pant", "chino", "cotton", "men", "trouser"],
        variants: [
          { colorName: "Khaki", colorHex: "#c2a649", sizeName: "32", price: 1450, stock: 12, sku: "P-KHK-32" },
          { colorName: "Olive Green", colorHex: "#556b2f", sizeName: "34", price: 1450, stock: 15, sku: "P-OLV-34" },
          { colorName: "Jet Black", colorHex: "#0a0a0a", sizeName: "32", price: 1450, stock: 8, sku: "P-BLK-32" },
        ],
      },
      {
        name: "Canva Pro Lifetime Owner Access (Digital Activation)",
        slug: "canva-pro-lifetime-owner-access",
        shortDescription: "Original Brand Kit, 100M+ Stock Assets & AI Magic Studio",
        description: "100% private brand kit account. Unlimited cloud storage, background remover in 1-click, resize designs instantly, and full access to AI magic write & expand tools.",
        category: digitalItems._id,
        vendor: vendorGadgetKing._id,
        mainImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        galleryImages: [],
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
        tags: ["canva", "digital", "design", "pro", "lifetime"],
        variants: [
          { colorName: "Single User", sizeName: "1 Year", price: 499, stock: 500, sku: "CANVA-1Y" },
          { colorName: "Admin Owner", sizeName: "Lifetime", price: 999, stock: 499, sku: "CANVA-LIFE" },
        ],
      },
    ]);

    console.log("Products seeded successfully.");

    // 4. Seed Delivery Zones (Dhaka vs Outside Dhaka)
    await DeliveryZone.create([
      { division: "Dhaka", district: "Dhaka City", deliveryCharge: 60, estimatedDelivery: "24-48 Hours" },
      { division: "Dhaka", district: "Gazipur", deliveryCharge: 100, estimatedDelivery: "2-3 Days" },
      { division: "Dhaka", district: "Narayanganj", deliveryCharge: 100, estimatedDelivery: "2-3 Days" },
      { division: "Chittagong", district: "Chittagong City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
      { division: "Chittagong", district: "Cox's Bazar", deliveryCharge: 130, estimatedDelivery: "3-4 Days" },
      { division: "Sylhet", district: "Sylhet City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
      { division: "Rajshahi", district: "Rajshahi City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
      { division: "Khulna", district: "Khulna City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
      { division: "Barisal", district: "Barisal City", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
      { division: "Rangpur", district: "Rangpur City", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
      { division: "Mymensingh", district: "Mymensingh City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
    ]);

    console.log("Delivery zones seeded successfully.");

    // 5. Seed Coupons
    await Coupon.create([
      {
        code: "SAVE10",
        discountType: "percentage",
        discountAmount: 10,
        minSpend: 500,
        maxDiscount: 300,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: "WELCOME50",
        discountType: "flat",
        discountAmount: 50,
        minSpend: 400,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log("Coupons seeded successfully.");

    // 6. Seed Sample Trackable Order
    const sampleProduct = await Product.findOne();
    if (sampleProduct) {
      await Order.create({
        invoiceId: "SG-10025",
        customer: {
          name: "Mohammad Fahim",
          phone: "01712345678",
          address: "House 15, Road 3, Sector 10, Uttara",
          division: "Dhaka",
          district: "Dhaka City",
          note: "Please deliver after 2 PM",
        },
        items: [
          {
            productId: sampleProduct._id,
            name: sampleProduct.name,
            image: sampleProduct.mainImage,
            variantInfo: "Color: Black / Size: L",
            price: sampleProduct.basePrice,
            quantity: 1,
            total: sampleProduct.basePrice,
          },
        ],
        subtotal: sampleProduct.basePrice,
        deliveryCharge: 60,
        discount: 0,
        grandTotal: sampleProduct.basePrice + 60,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "processing",
        timeline: [
          { status: "Order Placed", timestamp: new Date(Date.now() - 3600000 * 5), note: "অর্ডার সফলভাবে গ্রহণ করা হয়েছে।" },
          { status: "Order Confirmed", timestamp: new Date(Date.now() - 3600000 * 3), note: "অর্ডার কনফার্ম করা হয়েছে এবং প্যাকিং চলছে।" },
          { status: "Handed over to Courier", timestamp: new Date(Date.now() - 3600000 * 1), note: "Steadfast কুরিয়ার সার্ভিসে হস্তান্তর করা হয়েছে।" },
        ],
      });
      console.log("Sample trackable order SG-10025 seeded.");
    }

    console.log("🎉 All seed data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
