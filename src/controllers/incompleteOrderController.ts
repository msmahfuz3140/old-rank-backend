import { Request, Response } from "express";
import mongoose from "mongoose";
import { IncompleteOrder } from "../models/IncompleteOrder";

const memoryIncompleteOrders: any[] = [
  {
    _id: "inc_1",
    phone: "01844998811",
    name: "শাকিল হোসেন",
    address: "মিরপুর ১০, ঢাকা",
    division: "Dhaka",
    district: "Dhaka City",
    items: [
      {
        name: "Intel Core i5 Desktop Computer Full Setup Gaming PC",
        price: 42500,
        quantity: 1,
      },
    ],
    subtotal: 42500,
    deliveryCharge: 60,
    isConverted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    _id: "inc_2",
    phone: "01733221100",
    name: "সাদিয়া আক্তার",
    address: "নাসিরাবাদ, চট্টগ্রাম",
    division: "Chittagong",
    district: "Chittagong City",
    items: [
      {
        name: "Ultra Modern Smartwatch Series 9 with AMOLED Display",
        price: 2850,
        quantity: 1,
      },
    ],
    subtotal: 2850,
    deliveryCharge: 120,
    isConverted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
  },
  {
    _id: "inc_3",
    phone: "01955443322",
    name: "মেহেদী হাসান",
    address: "বোয়ালিয়া, রাজশাহী",
    division: "Rajshahi",
    district: "Rajshahi City",
    items: [
      {
        name: "Premium Oxford Cotton Long Sleeve Casual Shirt",
        price: 1250,
        quantity: 2,
      },
    ],
    subtotal: 2500,
    deliveryCharge: 120,
    isConverted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
];

export const saveIncompleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, name, address, division, district, items, subtotal, deliveryCharge, sessionId } =
      req.body;

    if (!phone) {
      res.status(400).json({ success: false, message: "মোবাইল নম্বর প্রয়োজন" });
      return;
    }

    const cleanPhone = String(phone).replace(/\s+/g, "");

    if (mongoose.connection.readyState === 1) {
      const existing = await IncompleteOrder.findOne({
        phone: cleanPhone,
        isConverted: false,
      });

      if (existing) {
        existing.name = name || existing.name;
        existing.address = address || existing.address;
        existing.division = division || existing.division;
        existing.district = district || existing.district;
        if (items && items.length > 0) {
          existing.items = items;
        }
        existing.subtotal = subtotal || existing.subtotal;
        existing.deliveryCharge = deliveryCharge || existing.deliveryCharge;
        existing.lastActiveAt = new Date();
        await existing.save();

        res.json({ success: true, message: "ইনকমপ্লিট অর্ডার আপডেট হয়েছে", data: existing });
        return;
      }

      const newIncomplete = new IncompleteOrder({
        sessionId: sessionId || "",
        phone: cleanPhone,
        name: name || "",
        address: address || "",
        division: division || "",
        district: district || "",
        items: items || [],
        subtotal: subtotal || 0,
        deliveryCharge: deliveryCharge || 0,
        isConverted: false,
        lastActiveAt: new Date(),
      });

      await newIncomplete.save();

      res.status(201).json({
        success: true,
        message: "ইনকমপ্লিট অর্ডার সংরক্ষিত হয়েছে",
        data: newIncomplete,
      });
      return;
    }

    // Resilient memory store
    const existingMem = memoryIncompleteOrders.find((i) => i.phone === cleanPhone && !i.isConverted);
    if (existingMem) {
      existingMem.name = name || existingMem.name;
      existingMem.address = address || existingMem.address;
      existingMem.subtotal = subtotal || existingMem.subtotal;
      existingMem.items = items || existingMem.items;
      existingMem.updatedAt = new Date().toISOString();
      res.json({ success: true, message: "ইনকমপ্লিট অর্ডার আপডেট হয়েছে", data: existingMem });
      return;
    }

    const newMem = {
      _id: `inc_${Date.now()}`,
      phone: cleanPhone,
      name: name || "",
      address: address || "",
      division: division || "Dhaka",
      district: district || "Dhaka City",
      items: items || [],
      subtotal: subtotal || 0,
      deliveryCharge: deliveryCharge || 60,
      isConverted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryIncompleteOrders.unshift(newMem);

    res.status(201).json({ success: true, message: "ইনকমপ্লিট অর্ডার সংরক্ষিত হয়েছে", data: newMem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getIncompleteOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const incompleteOrders = await IncompleteOrder.find({ isConverted: false })
        .sort({ updatedAt: -1 })
        .limit(50);

      res.json({ success: true, data: incompleteOrders });
      return;
    }

    res.json({ success: true, data: memoryIncompleteOrders });
  } catch (error: any) {
    res.json({ success: true, data: memoryIncompleteOrders });
  }
};
