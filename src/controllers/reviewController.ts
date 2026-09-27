import { Request, Response } from "express";
import mongoose from "mongoose";
import { Review } from "../models/Review";
import { Product } from "../models/Product";
import { Order } from "../models/Order";

// Helper: Mask phone number for privacy (e.g. 01712345678 -> 017****5678)
function maskPhone(phone?: string): string {
  if (!phone || phone.length < 7) return "";
  return phone.slice(0, 3) + "****" + phone.slice(-4);
}

// GET /api/v1/reviews/product/:idOrSlug
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const idOrSlug = String(req.params.idOrSlug || "");

    let product = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      product = await Product.findById(idOrSlug).select("_id name slug rating reviewCount");
    }
    if (!product) {
      product = await Product.findOne({ slug: idOrSlug }).select("_id name slug rating reviewCount");
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "প্রোডাক্ট পাওয়া যায়নি" });
    }

    const reviews = await Review.find({
      productId: product._id,
      status: "approved",
    }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    let avgRating = 5;
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => {
        const star = Math.min(Math.max(Math.round(r.rating || 5), 1), 5) as 1 | 2 | 3 | 4 | 5;
        breakdown[star] = (breakdown[star] || 0) + 1;
        return acc + (r.rating || 5);
      }, 0);
      avgRating = Number((sum / totalReviews).toFixed(1));
    }

    // Mask phone for public display
    const sanitizedReviews = reviews.map((r) => ({
      _id: r._id,
      customerName: r.customerName,
      customerCity: r.customerCity || "",
      customerPhone: maskPhone(r.customerPhone),
      rating: r.rating,
      comment: r.comment,
      isVerifiedPurchase: r.isVerifiedPurchase,
      orderInvoiceId: r.orderInvoiceId ? `***${r.orderInvoiceId.slice(-4)}` : "",
      createdAt: r.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: sanitizedReviews,
      stats: {
        rating: avgRating,
        reviewCount: totalReviews,
        breakdown,
      },
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return res.status(500).json({ success: false, message: "রিভিউ লোড করতে সমস্যা হয়েছে" });
  }
};

// POST /api/v1/reviews
export const createReview = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      productSlug,
      customerName,
      customerPhone,
      customerCity,
      rating,
      comment,
      orderInvoiceId,
    } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: "আপনার নাম দিন" });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "আপনার রিভিউ মন্তব্য লিখুন" });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: "১ থেকে ৫ এর মধ্যে রেটিং দিন" });
    }

    let product = null;
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }
    if (!product && productSlug) {
      product = await Product.findOne({ slug: productSlug });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "প্রোডাক্ট পাওয়া যায়নি" });
    }

    // Check if verified purchase
    let isVerifiedPurchase = false;
    let matchedInvoice = orderInvoiceId?.trim() || "";

    const cleanPhone = (customerPhone || "").replace(/\s+/g, "").replace(/^\+88/, "");

    if (matchedInvoice) {
      const order = await Order.findOne({ invoiceId: new RegExp(`^${matchedInvoice}$`, "i") });
      if (order) {
        const hasItem = order.items.some(
          (it: any) =>
            String(it.productId) === String(product._id) ||
            it.name.toLowerCase().includes(product.name.toLowerCase().slice(0, 15))
        );
        if (hasItem) {
          isVerifiedPurchase = true;
        }
      }
    }

    if (!isVerifiedPurchase && cleanPhone && cleanPhone.length >= 10) {
      const order = await Order.findOne({
        "customer.phone": new RegExp(cleanPhone.slice(-10)),
        status: { $in: ["confirmed", "processing", "shipped", "delivered"] },
      });
      if (order) {
        const hasItem = order.items.some(
          (it: any) =>
            String(it.productId) === String(product._id) ||
            it.name.toLowerCase().includes(product.name.toLowerCase().slice(0, 15))
        );
        if (hasItem) {
          isVerifiedPurchase = true;
          if (!matchedInvoice) matchedInvoice = order.invoiceId;
        }
      }
    }

    // Save review
    const newReview = await Review.create({
      productId: product._id,
      productSlug: product.slug,
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      customerCity: customerCity?.trim() || "",
      rating: Math.round(numRating),
      comment: comment.trim(),
      isVerifiedPurchase,
      orderInvoiceId: matchedInvoice,
      status: "approved",
    });

    // Recalculate average rating & review count for the product
    const allApprovedReviews = await Review.find({
      productId: product._id,
      status: "approved",
    });

    const newCount = allApprovedReviews.length;
    const newSum = allApprovedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAvg = newCount > 0 ? Number((newSum / newCount).toFixed(1)) : 5.0;

    await Product.findByIdAndUpdate(product._id, {
      rating: newAvg,
      reviewCount: newCount,
    });

    return res.status(201).json({
      success: true,
      message: isVerifiedPurchase
        ? "ধন্যবাদ! আপনার যাচাইকৃত ক্রেতার (Verified Purchase) রিভিউ সফলভাবে গৃহীত হয়েছে।"
        : "ধন্যবাদ! আপনার রিভিউ সফলভাবে গৃহীত হয়েছে।",
      data: {
        ...newReview.toObject(),
        customerPhone: maskPhone(cleanPhone),
      },
      productStats: {
        rating: newAvg,
        reviewCount: newCount,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ success: false, message: "রিভিউ সংরক্ষণ করতে সমস্যা হয়েছে" });
  }
};

// GET /api/v1/reviews/recent-orders?phone=017...&invoiceId=...
export const checkCustomerRecentOrders = async (req: Request, res: Response) => {
  try {
    const { phone, invoiceId } = req.query;

    const query: any = {};
    if (invoiceId) {
      query.invoiceId = new RegExp(`^${String(invoiceId).trim()}$`, "i");
    } else if (phone) {
      const clean = String(phone).replace(/\s+/g, "").replace(/^\+88/, "");
      query["customer.phone"] = new RegExp(clean.slice(-10));
    } else {
      return res.status(400).json({ success: false, message: "মোবাইল নম্বর বা ইনভয়েস আইডি দিন" });
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .select("invoiceId customer items status createdAt");

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error checking customer orders for review:", error);
    return res.status(500).json({ success: false, message: "অর্ডার যাচাইয়ে সমস্যা হয়েছে" });
  }
};
