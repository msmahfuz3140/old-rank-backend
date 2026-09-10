import { Request, Response } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";

export const getSalesNotifications = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Attempt to pull from real recent orders first
    const recentOrders = await Order.find({ status: { $ne: "cancelled" } })
      .sort({ createdAt: -1 })
      .limit(10);

    let items = [];

    if (recentOrders.length > 0) {
      items = recentOrders.flatMap((order: any) =>
        order.items.map((item: any) => ({
          name: `${order.customer.name.split(" ")[0]} from ${order.customer.district || "Dhaka"}`,
          product_name: item.name,
          time: "Just now",
          image: item.image,
          product_url: `/product/${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        }))
      );
    }

    // If fewer than 5 items, supplement with top products for social proof
    if (items.length < 5) {
      const topProducts = await Product.find({ isActive: true }).limit(8);
      const sampleLocations = ["Dhanmondi", "Uttara", "Mirpur", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Gazipur"];
      const sampleNames = ["Tanvir", "Sabbir", "Nusrat", "Mehedi", "Farzana", "Rakib", "Sadia", "Imran"];

      const fallbackItems = topProducts.map((p, idx) => ({
        name: `${sampleNames[idx % sampleNames.length]} from ${sampleLocations[idx % sampleLocations.length]}`,
        product_name: p.name,
        time: `${(idx + 1) * 3} minutes ago`,
        image: p.mainImage,
        product_url: `/product/${p.slug}`,
      }));

      items = [...items, ...fallbackItems];
    }

    res.json({
      enabled: true,
      display_duration: 5000,
      interval_min: 8000,
      interval_max: 15000,
      items,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
