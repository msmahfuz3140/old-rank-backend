import { Request, Response } from "express";
import { Coupon } from "../models/Coupon";

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: "কুপন কোড প্রদান করুন" });
      return;
    }

    const coupon = await Coupon.findOne({
      code: String(code).trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      res.status(404).json({ success: false, message: "অবৈধ কুপন কোড!" });
      return;
    }

    if (new Date() > new Date(coupon.expiresAt)) {
      res.status(400).json({ success: false, message: "কুপন কোডটির মেয়াদ শেষ হয়ে গেছে!" });
      return;
    }

    const cartSubtotal = Number(subtotal) || 0;
    if (cartSubtotal < coupon.minSpend) {
      res.status(400).json({
        success: false,
        message: `এই কুপনটি পেতে সর্বনিম্ন ৳${coupon.minSpend} টাকার কেনাকাটা প্রয়োজন।`,
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartSubtotal * coupon.discountAmount) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountAmount;
    }

    res.json({
      success: true,
      message: `অভিনন্দন! আপনি ৳${discount} টাকা ছাড় পেয়েছেন।`,
      data: {
        code: coupon.code,
        discount: Math.round(discount),
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
