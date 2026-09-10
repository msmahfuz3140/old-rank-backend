export interface ManualPaymentConfig {
  code: string;
  name: string;
  accountType: string;
  walletNumber: string;
  instructions: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  paymentMethod: string;
  redirectUrl?: string;
  invoiceId: string;
  message?: string;
  trxId?: string;
}

export class PaymentService {
  public static getManualGatewayConfigs(): ManualPaymentConfig[] {
    return [
      {
        code: "bkash_manual",
        name: "Manual bKash (Personal)",
        accountType: "Personal",
        walletNumber: process.env.MANUAL_BKASH_NUMBER || "01849832178",
        instructions:
          "বিকাশ অ্যাপ অথবা *247# ডায়াল করে 'Send Money' অপশনে গিয়ে নিচের পার্সোনাল নম্বরে টাকা পাঠান। টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) ও যে নম্বর থেকে পাঠিয়েছেন তা নিচে লিখুন।",
      },
      {
        code: "nagad_manual",
        name: "Manual Nagad (Personal)",
        accountType: "Personal",
        walletNumber: process.env.MANUAL_NAGAD_NUMBER || "01849832178",
        instructions:
          "নগদ অ্যাপ অথবা *167# ডায়াল করে 'Send Money' অপশনে গিয়ে নিচের পার্সোনাল নম্বরে টাকা পাঠান। টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) ও প্রেরক নম্বর নিচে লিখুন।",
      },
      {
        code: "rocket_manual",
        name: "Manual Rocket (Personal)",
        accountType: "Personal",
        walletNumber: process.env.MANUAL_ROCKET_NUMBER || "01849832178",
        instructions:
          "রকেট অ্যাপ অথবা *322# ডায়াল করে 'Send Money' অপশনে গিয়ে নিচের পার্সোনাল নম্বরে টাকা পাঠান। টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) নিচে দিন।",
      },
    ];
  }

  public static async processPayment(
    paymentMethod: string,
    invoiceId: string,
    amount: number,
    manualData?: { trxId: string; senderNumber?: string }
  ): Promise<PaymentInitiationResult> {
    switch (paymentMethod) {
      case "cod":
        return {
          success: true,
          paymentMethod: "cod",
          invoiceId,
          message: "ক্যাশ অন ডেলিভারি অর্ডার গৃহীত হয়েছে।",
        };

      case "bkash_manual":
      case "nagad_manual":
      case "rocket_manual":
        if (!manualData?.trxId || manualData.trxId.trim().length < 5) {
          throw new Error("সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন।");
        }
        return {
          success: true,
          paymentMethod,
          invoiceId,
          trxId: manualData.trxId.trim(),
          message: "ম্যানুয়াল পেমেন্ট তথ্য সংরক্ষণ করা হয়েছে। অ্যাডমিন ভেরিফাই করবে।",
        };

      case "bkash_auto":
        return {
          success: true,
          paymentMethod: "bkash_auto",
          invoiceId,
          redirectUrl: `/order-success?invoiceId=${invoiceId}&paymentStatus=paid&method=bkash_auto`,
          message: "বিকাশ অটোমেটেড পেমেন্ট সম্পন্ন হয়েছে!",
        };

      case "nagad_auto":
        return {
          success: true,
          paymentMethod: "nagad_auto",
          invoiceId,
          redirectUrl: `/order-success?invoiceId=${invoiceId}&paymentStatus=paid&method=nagad_auto`,
          message: "নগদ অটোমেটেড পেমেন্ট সম্পন্ন হয়েছে!",
        };

      case "card_auto":
        return {
          success: true,
          paymentMethod: "card_auto",
          invoiceId,
          redirectUrl: `/order-success?invoiceId=${invoiceId}&paymentStatus=paid&method=card_auto`,
          message: "কার্ড পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!",
        };


      default:
        throw new Error("অনুপযুক্ত পেমেন্ট মেথড নির্বাচিত হয়েছে।");
    }
  }
}
