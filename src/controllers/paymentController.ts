import { Request, Response } from "express";
import { PaymentService } from "../services/paymentService";
import { Order } from "../models/Order";

export const getPaymentGateways = async (_req: Request, res: Response): Promise<void> => {
  try {
    const manualGateways = PaymentService.getManualGatewayConfigs();
    res.json({
      success: true,
      data: {
        cod: { enabled: true, title: "Cash On Delivery", subtitle: "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন" },
        manual: manualGateways,
        automatic: [
          { code: "bkash_auto", name: "bKash Gateway", logo: "/images/bkash.svg", subtitle: "বিকাশ অ্যাপ বা গেটওয়ে দ্বারা তাৎক্ষণিক পেমেন্ট" },
          { code: "nagad_auto", name: "Nagad Gateway", logo: "/images/nagad.svg", subtitle: "নগদ অনলাইন পেমেন্ট গেটওয়ে" },
          { code: "card_auto", name: "Cards & Banking", logo: "/images/cards.svg", subtitle: "Visa / Mastercard / Amex / Internet Banking" },
        ],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPaymentCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, invoiceId, amount, trxId } = req.query;

    if (!invoiceId) {
      res.status(400).json({ success: false, message: "ইনভয়েস আইডি পাওয়া যায়নি" });
      return;
    }

    const order = await Order.findOne({ invoiceId: String(invoiceId) });
    if (!order) {
      res.status(404).json({ success: false, message: "অর্ডার খুঁজে পাওয়া যায়নি" });
      return;
    }

    if (status === "success") {
      order.paymentStatus = "paid";
      order.timeline.push({
        status: "Payment Completed",
        timestamp: new Date(),
        note: `অনলাইন পেমেন্ট সম্পন্ন হয়েছে (৳${amount || order.grandTotal}) TrxID: ${trxId || "AUTO-" + Date.now()}`,
      });
      await order.save();

      res.json({
        success: true,
        message: "পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে!",
        invoiceId: order.invoiceId,
        order,
      });
    } else {
      order.paymentStatus = "failed";
      await order.save();
      res.status(400).json({
        success: false,
        message: "পেমেন্ট সম্পন্ন হয়নি। ক্যাশ অন ডেলিভারি অথবা পুনরায় চেষ্টা করুন।",
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
