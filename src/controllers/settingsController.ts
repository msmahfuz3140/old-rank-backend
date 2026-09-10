import { Request, Response } from "express";
import mongoose from "mongoose";
import { Settings } from "../models/Settings";

// Default in-memory cache for ultra-fast response and offline resilience
let cachedSettings = {
  isOfferActive: true,
  offerTitle: "হট ডিল কালেকশন",
  offerSubtitle: "সবচেয়ে বেশি বিক্রিত পণ্যগুলোতে বিশাল ডিসকাউন্ট অফার",
  offerEndTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  discountBadge: "সীমিত স্টক",
};

export const getHotDealSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Settings.findOne({ key: "site_settings" }).maxTimeMS(800);
        if (doc && doc.hotDeal) {
          cachedSettings = {
            isOfferActive: doc.hotDeal.isOfferActive !== undefined ? doc.hotDeal.isOfferActive : cachedSettings.isOfferActive,
            offerTitle: doc.hotDeal.offerTitle || cachedSettings.offerTitle,
            offerSubtitle: doc.hotDeal.offerSubtitle || cachedSettings.offerSubtitle,
            offerEndTime: doc.hotDeal.offerEndTime || cachedSettings.offerEndTime,
            discountBadge: doc.hotDeal.discountBadge || cachedSettings.discountBadge,
          };
        }
      } catch (err) {
        // Fall back to memory
      }
    }

    res.json({
      success: true,
      data: cachedSettings,
    });
  } catch (error: any) {
    res.json({
      success: true,
      data: cachedSettings,
    });
  }
};

export const updateHotDealSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isOfferActive, offerTitle, offerSubtitle, offerEndTime, discountBadge } = req.body;

    cachedSettings = {
      ...cachedSettings,
      ...(isOfferActive !== undefined && { isOfferActive: Boolean(isOfferActive) }),
      ...(offerTitle !== undefined && { offerTitle: String(offerTitle) }),
      ...(offerSubtitle !== undefined && { offerSubtitle: String(offerSubtitle) }),
      ...(offerEndTime !== undefined && { offerEndTime: String(offerEndTime) }),
      ...(discountBadge !== undefined && { discountBadge: String(discountBadge) }),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        await Settings.findOneAndUpdate(
          { key: "site_settings" },
          { $set: { hotDeal: cachedSettings } },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn("MongoDB settings update skipped:", err);
      }
    }

    res.json({
      success: true,
      message: "হট অফার ও টাইমার সফলভাবে আপডেট করা হয়েছে!",
      data: cachedSettings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "হট অফার আপডেট করা সম্ভব হয়নি।",
    });
  }
};
