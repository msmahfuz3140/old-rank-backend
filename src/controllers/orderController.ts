import { Request, Response } from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { IncompleteOrder } from "../models/IncompleteOrder";
import { PaymentService } from "../services/paymentService";

const generateInvoiceId = (): string => {
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(100 + Math.random() * 900);
  return `OR-${timestamp}${random}`;
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      phone,
      address,
      division,
      district,
      note,
      items,
      subtotal,
      deliveryCharge,
      discount = 0,
      grandTotal,
      paymentMethod,
      manualTrxId,
      manualSenderNumber,
      couponCode,
      trafficSource = "direct",
      trafficReferrer = "",
    } = req.body;

    if (!name || !phone || !address || !items || items.length === 0) {
      res.status(400).json({
        success: false,
        message: "অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর, সম্পূর্ণ ঠিকানা এবং অন্তত একটি পণ্য নির্বাচন করুন।",
      });
      return;
    }

    // Bangladeshi phone validation (11 digits, starts with 01)
    const cleanPhone = String(phone).replace(/\s+/g, "");
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      res.status(400).json({
        success: false,
        message: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)",
      });
      return;
    }

    // Sanitize items and resolve costPrice for accurate profit/loss accounting
    const sanitizedItems = await Promise.all(
      items.map(async (i: any) => {
        let itemCost = Number(i.costPrice) || 0;
        if (itemCost <= 0 && mongoose.connection.readyState === 1) {
          try {
            const prod = await Product.findOne({
              $or: [
                { _id: mongoose.isValidObjectId(i.productId) ? i.productId : null },
                { name: i.name },
              ],
            });
            if (prod?.costPrice) {
              itemCost = Number(prod.costPrice);
            }
          } catch {}
        }
        if (itemCost <= 0 && Number(i.price) > 0) {
          itemCost = Math.round(Number(i.price) * 0.6);
        }

        return {
          productId: i.productId || "p1",
          name: i.name || "Product",
          image: i.image || "",
          variantInfo: i.variantInfo || "",
          price: Number(i.price) || 0,
          costPrice: itemCost,
          quantity: Number(i.quantity) || 1,
          total: Number(i.total) || (Number(i.price) || 0) * (Number(i.quantity) || 1),
        };
      })
    );

    const invoiceId = generateInvoiceId();

    // Process payment
    const paymentResult = await PaymentService.processPayment(
      paymentMethod,
      invoiceId,
      grandTotal,
      manualTrxId ? { trxId: manualTrxId, senderNumber: manualSenderNumber } : undefined
    );

    let paymentStatus: "pending" | "paid" | "pending_verification" = "pending";
    const orderStatus: "pending" = "pending";

    if (["bkash_manual", "nagad_manual", "rocket_manual"].includes(paymentMethod)) {
      paymentStatus = "pending_verification";
    } else if (["bkash_auto", "nagad_auto", "card_auto"].includes(paymentMethod)) {
      paymentStatus = "paid";
    } else {
      paymentStatus = "pending";
    }

    const newOrder = new Order({
      invoiceId,
      customer: {
        name,
        phone: cleanPhone,
        address,
        division: division || "Dhaka",
        district: district || "Dhaka City",
        note: note || "",
      },
      items: sanitizedItems,
      subtotal: Number(subtotal) || 0,
      deliveryCharge: Number(deliveryCharge) || 0,
      discount: Number(discount) || 0,
      grandTotal: Number(grandTotal) || 0,
      paymentMethod,
      paymentStatus,
      manualPaymentDetails: {
        trxId: manualTrxId || "",
        senderNumber: manualSenderNumber || "",
      },
      status: orderStatus,
      timeline: [
        {
          status: "Order Placed",
          timestamp: new Date(),
          note: `গ্রাহক সফলভাবে অর্ডার সাবমিট করেছেন (${paymentMethod.replace("_", " ").toUpperCase()})।`,
        },
      ],
      couponCode: couponCode || "",
      trafficSource,
      trafficReferrer,
    });

    if (mongoose.connection.readyState === 1) {
      try {
        await newOrder.save();
        await IncompleteOrder.updateMany(
          { phone: cleanPhone, isConverted: false },
          { isConverted: true, convertedOrderId: newOrder._id }
        );
      } catch (dbErr: any) {
        console.warn("DB save failed, persisting to memoryOrders:", dbErr.message);
        memoryOrders.unshift(newOrder.toObject ? newOrder.toObject() : newOrder);
      }
    } else {
      memoryOrders.unshift(newOrder.toObject ? newOrder.toObject() : newOrder);
    }

    res.status(201).json({
      success: true,
      message: "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!",
      data: {
        order: newOrder,
        paymentResult,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const trackOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query; // phone or invoiceId

    if (!query) {
      res.status(400).json({
        success: false,
        message: "অনুগ্রহ করে মোবাইল নম্বর অথবা ইনভয়েস আইডি দিন।",
      });
      return;
    }

    const cleanQuery = String(query).trim();

    // Search by invoice ID or phone
    const orders = await Order.find({
      $or: [
        { invoiceId: { $regex: cleanQuery, $options: "i" } },
        { "customer.phone": cleanQuery },
      ],
    }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      res.status(404).json({
        success: false,
        message: "এই তথ্য অনুযায়ী কোনো অর্ডার পাওয়া যায়নি। সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।",
      });
      return;
    }

    res.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceId } = req.params;
    const order = await Order.findOne({ invoiceId });

    if (!order) {
      res.status(404).json({ success: false, message: "অর্ডার পাওয়া যায়নি" });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In-memory orders store for clean production
const memoryOrders: any[] = [];

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      let filter: any = {};
      if (status && status !== "all") {
        filter.status = status;
      }
      if (search) {
        const cleanSearch = String(search).trim();
        filter.$or = [
          { invoiceId: { $regex: cleanSearch, $options: "i" } },
          { "customer.phone": { $regex: cleanSearch, $options: "i" } },
          { "customer.name": { $regex: cleanSearch, $options: "i" } },
        ];
      }
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      res.json({ success: true, data: orders });
      return;
    }

    // Resilient memory store
    let filtered = [...memoryOrders];
    if (status && status !== "all") {
      filtered = filtered.filter((o) => o.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.invoiceId.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, data: filtered });
  } catch (error: any) {
    res.json({ success: true, data: memoryOrders });
  }
};

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: "pending" });
      const confirmedOrders = await Order.countDocuments({ status: "confirmed" });
      const processingOrders = await Order.countDocuments({ status: "processing" });
      const shippedOrders = await Order.countDocuments({ status: "shipped" });
      const deliveredOrders = await Order.countDocuments({ status: "delivered" });
      const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
      const incompleteCount = await IncompleteOrder.countDocuments({ isConverted: false });
      const activeProductsCount = await Product.countDocuments({ isActive: true });

      const allOrders = await Order.find({ status: { $ne: "cancelled" } });
      let totalRevenue = 0;
      let totalCost = 0;
      let pendingRevenue = 0;
      let confirmedRevenue = 0;
      let confirmedCost = 0;

      for (const ord of allOrders) {
        const amt = Number(ord.grandTotal) || Number(ord.subtotal) || 0;
        let cogs = 0;
        if (ord.items && Array.isArray(ord.items)) {
          for (const item of ord.items) {
            cogs += (Number(item.costPrice) || 0) * (Number(item.quantity) || 1);
          }
        }

        totalRevenue += amt;
        totalCost += cogs;

        if (ord.status === "pending") {
          pendingRevenue += amt;
        } else {
          confirmedRevenue += amt;
          confirmedCost += cogs;
        }
      }

      res.json({
        success: true,
        data: {
          totalRevenue,
          totalSales: totalRevenue,
          totalCost,
          netProfit: totalRevenue - totalCost,
          pendingRevenue,
          confirmedRevenue,
          confirmedCost,
          totalOrders,
          pendingOrders,
          confirmedOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          incompleteCount,
          activeProductsCount,
        },
      });
      return;
    }

    const totalOrders = memoryOrders.length;
    const pendingOrders = memoryOrders.filter((o) => o.status === "pending").length;
    const confirmedOrders = memoryOrders.filter((o) => o.status === "confirmed").length;
    const deliveredOrders = memoryOrders.filter((o) => o.status === "delivered").length;
    const liveOrders = memoryOrders.filter((o) => o.status !== "cancelled");
    const totalRevenue = liveOrders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
    const totalCost = liveOrders.reduce((sum, o) => {
      const c = (o.items || []).reduce((isum: number, item: any) => isum + (Number(item.costPrice) || 0) * (Number(item.quantity) || 1), 0);
      return sum + c;
    }, 0);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalSales: totalRevenue,
        totalCost,
        netProfit: totalRevenue - totalCost,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        incompleteCount: 0,
        activeProductsCount: 8,
      },
    });
  } catch (error: any) {
    res.json({
      success: true,
      data: {
        totalRevenue: 0,
        totalSales: 0,
        totalCost: 0,
        netProfit: 0,
        totalOrders: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        deliveredOrders: 0,
        incompleteCount: 0,
        activeProductsCount: 0,
      },
    });
  }
};


export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceId } = req.params;
    const { status, note } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOne({ invoiceId });
      if (!order) {
        res.status(404).json({ success: false, message: "অর্ডার পাওয়া যায়নি" });
        return;
      }

      order.status = status;
      order.timeline.push({
        status,
        timestamp: new Date(),
        note: note || `অর্ডার স্ট্যাটাস আপডেট: ${status}`,
      });

      if (status === "delivered") {
        order.paymentStatus = "paid";
      }

      await order.save();
      res.json({ success: true, message: "অর্ডার স্ট্যাটাস আপডেট সফল", data: order });
      return;
    }

    const memoryOrder = memoryOrders.find((o) => o.invoiceId === invoiceId);
    if (!memoryOrder) {
      res.status(404).json({ success: false, message: "অর্ডার পাওয়া যায়নি" });
      return;
    }
    memoryOrder.status = status;
    if (status === "delivered") memoryOrder.paymentStatus = "paid";
    memoryOrder.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `অর্ডার স্ট্যাটাস আপডেট: ${status}`,
    });

    res.json({ success: true, message: "অর্ডার স্ট্যাটাস আপডেট সফল", data: memoryOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceId } = req.params;
    const { paymentStatus } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOne({ invoiceId });
      if (!order) {
        res.status(404).json({ success: false, message: "অর্ডার পাওয়া যায়নি" });
        return;
      }

      order.paymentStatus = paymentStatus;
      if (paymentStatus === "paid" && order.status === "pending") {
        order.status = "confirmed";
        order.timeline.push({
          status: "confirmed",
          timestamp: new Date(),
          note: "পেমেন্ট যাচাইকরণ সম্পন্ন এবং অর্ডার কনফার্ম করা হয়েছে।",
        });
      }

      await order.save();
      res.json({ success: true, message: "পেমেন্ট স্ট্যাটাস আপডেট সফল", data: order });
      return;
    }

    const memoryOrder = memoryOrders.find((o) => o.invoiceId === invoiceId);
    if (!memoryOrder) {
      res.status(404).json({ success: false, message: "অর্ডার পাওয়া যায়নি" });
      return;
    }
    memoryOrder.paymentStatus = paymentStatus;
    if (paymentStatus === "paid" && memoryOrder.status === "pending") {
      memoryOrder.status = "confirmed";
      memoryOrder.timeline.push({
        status: "confirmed",
        timestamp: new Date(),
        note: "পেমেন্ট যাচাইকরণ সম্পন্ন এবং অর্ডার কনফার্ম করা হয়েছে।",
      });
    }

    res.json({ success: true, message: "পেমেন্ট স্ট্যাটাস আপডেট সফল", data: memoryOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


