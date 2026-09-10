import { Request, Response } from "express";
import mongoose from "mongoose";
import { Vendor } from "../models/Vendor";
import { Product } from "../models/Product";

let fallbackVendors: any[] = [
  {
    _id: "v_or",
    shopName: "Old Rank Official",
    slug: "old-rank",
    logo: "/images/logo.png",
    banner: "/images/old-rank-banner.jpg",
    rating: 5.0,
    reviewCount: 350,
    isVerified: true,
    status: "Active",
    plan: "VIP",
    ownerName: "Old Rank Authority",
    email: "mdmahfuzulhaque3140@gmail.com",
    totalProducts: 45,
    phone: "01956016119",
    address: "Dhanmondi, Dhaka, Bangladesh",
    description: "Official Flagship Brand Store of Old Rank — Wear Your Rank.",
  },
  {
    _id: "v1",
    shopName: "Gadget King BD",
    slug: "gadget-king",
    logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 98,
    isVerified: true,
    status: "Active",
    plan: "Pro",
    ownerName: "তানভীর আহমেদ",
    email: "seller@gadgetking.com",
    totalProducts: 35,
    phone: "01822334455",
    address: "Multiplan Center, Elephant Road, Dhaka",
    description: "Original electronics, gadgets, and tech accessories with warranty.",
  },
  {
    _id: "v2",
    shopName: "Shapno Lifestyle",
    slug: "shapno",
    logo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 142,
    isVerified: true,
    totalProducts: 48,
    phone: "01711223344",
    address: "Dhanmondi 7, Dhaka",
    description: "Authentic premium fashion and lifestyle products direct from manufacturer.",
  },
  {
    _id: "v3",
    shopName: "Aarong Luxury Mart",
    slug: "aarong-luxury",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 210,
    isVerified: true,
    totalProducts: 64,
    phone: "01844556677",
    address: "Uttara Sector 3, Dhaka",
    description: "Exclusive traditional sarees, designer salwar kameez, and ladies luxury accessories.",
  },
  {
    _id: "v4",
    shopName: "Kids Paradise BD",
    slug: "kids-paradise",
    logo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 185,
    isVerified: true,
    totalProducts: 52,
    phone: "01933445566",
    address: "Bashundhara City, Panthapath, Dhaka",
    description: "Safe, organic and high quality baby care, newborn clothes, strollers and educational toys.",
  },
  {
    _id: "v5",
    shopName: "Smart Living Appliances",
    slug: "smart-living",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 160,
    isVerified: true,
    totalProducts: 40,
    phone: "01622334455",
    address: "Mirpur 10, Dhaka",
    description: "Original smart kitchen and home electric appliances with official manufacturer warranty.",
  },
];

export const getVendors = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const vendors = await Vendor.find().sort({ rating: -1, reviewCount: -1 }).maxTimeMS(1000);
        if (vendors && vendors.length > 0) {
          res.json({ success: true, data: vendors });
          return;
        }
      } catch {
        // use fallback
      }
    }
    res.json({ success: true, data: fallbackVendors });
  } catch (error: any) {
    res.json({ success: true, data: fallbackVendors });
  }
};

export const getVendorBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    let vendor: any = fallbackVendors.find((v) => v.slug === slug);

    if (mongoose.connection.readyState === 1) {
      try {
        const dbVendor = await Vendor.findOne({ slug }).maxTimeMS(1000);
        if (dbVendor) vendor = dbVendor;
      } catch {
        // use fallback
      }
    }

    if (!vendor) {
      vendor = fallbackVendors[0];
    }

    res.json({
      success: true,
      data: {
        vendor,
        products: [],
      },
    });
  } catch (error: any) {
    res.json({
      success: true,
      data: {
        vendor: fallbackVendors[0],
        products: [],
      },
    });
  }
};

export const createVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const cleanShop = data.shopName || "Untitled Shop";
    const slugBase = (data.slug || cleanShop).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const generatedSlug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const newVendor = {
      _id: `v_${Date.now()}`,
      shopName: cleanShop,
      slug: generatedSlug,
      logo: data.logo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      banner: data.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
      rating: 5.0,
      reviewCount: 1,
      isVerified: Boolean(data.isVerified !== undefined ? data.isVerified : true),
      status: data.status || "Active",
      plan: data.plan || "Pro",
      ownerName: data.ownerName || cleanShop,
      email: data.email || `${slugBase}@oldrank.com`,
      totalProducts: Number(data.totalProducts) || 0,
      phone: data.phone || "01956016119",
      address: data.address || "Dhaka, Bangladesh",
      description: data.description || `${cleanShop} — ভেরিফাইড মার্চেন্ট পার্টনার`,
      createdAt: new Date().toISOString(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        await Vendor.create(newVendor);
      } catch (err) {
        console.warn("MongoDB vendor create skipped:", err);
      }
    }

    fallbackVendors.unshift(newVendor);

    res.status(201).json({
      success: true,
      message: "সেলার সফলভাবে যুক্ত করা হয়েছে!",
      data: newVendor,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registerSeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const cleanShop = data.shopName || "New Merchant Store";
    const slugBase = cleanShop.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const generatedSlug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const newVendor = {
      _id: `v_${Date.now()}`,
      shopName: cleanShop,
      slug: generatedSlug,
      logo: data.logo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
      rating: 5.0,
      reviewCount: 0,
      isVerified: false,
      status: "Active",
      plan: data.plan || "Pro",
      ownerName: data.ownerName || cleanShop,
      email: data.email || `${slugBase}@gmail.com`,
      totalProducts: 0,
      phone: data.phone || "01700000000",
      address: data.address || "Bangladesh",
      description: data.description || `${cleanShop} — প্রিমিয়াম মার্চেন্ট স্টোর`,
      createdAt: new Date().toISOString(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        await Vendor.create(newVendor);
      } catch (err) {
        console.warn("MongoDB vendor register skipped:", err);
      }
    }

    fallbackVendors.unshift(newVendor);

    res.status(201).json({
      success: true,
      message: "🎉 অভিনন্দন! আপনার প্রিমিয়াম সেলার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
      data: newVendor,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        await Vendor.findByIdAndUpdate(id, updates);
      } catch (err) {
        console.warn("MongoDB vendor update skipped:", err);
      }
    }

    const idx = fallbackVendors.findIndex((v) => v._id === id || v.slug === id);
    if (idx !== -1) {
      fallbackVendors[idx] = { ...fallbackVendors[idx], ...updates };
      res.json({
        success: true,
        message: "সেলার তথ্য সফলভাবে আপডেট হয়েছে!",
        data: fallbackVendors[idx],
      });
      return;
    }

    res.json({
      success: true,
      message: "সেলার তথ্য আপডেট সম্পন্ন",
      data: updates,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        await Vendor.findByIdAndDelete(id);
      } catch (err) {
        console.warn("MongoDB vendor delete skipped:", err);
      }
    }

    fallbackVendors = fallbackVendors.filter((v) => v._id !== id && v.slug !== id);

    res.json({
      success: true,
      message: "সেলার সফলভাবে মুছে ফেলা হয়েছে!",
      id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
