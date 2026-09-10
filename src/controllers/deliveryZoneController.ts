import { Request, Response } from "express";
import mongoose from "mongoose";
import { DeliveryZone } from "../models/DeliveryZone";

const fallbackDeliveryZones = [
  { division: "Dhaka", district: "Dhaka City", deliveryCharge: 60, estimatedDelivery: "24-48 Hours", isActive: true },
  { division: "Dhaka", district: "Gazipur", deliveryCharge: 100, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Dhaka", district: "Narayanganj", deliveryCharge: 100, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Chattogram", district: "Chattogram City", deliveryCharge: 120, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Chattogram", district: "Cox's Bazar", deliveryCharge: 130, estimatedDelivery: "3-4 Days", isActive: true },
  { division: "Sylhet", district: "Sylhet City", deliveryCharge: 120, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Rajshahi", district: "Rajshahi City", deliveryCharge: 120, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Khulna", district: "Khulna City", deliveryCharge: 120, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Barishal", district: "Barishal City", deliveryCharge: 120, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Rangpur", district: "Rangpur City", deliveryCharge: 120, estimatedDelivery: "48-72 Hours", isActive: true },
  { division: "Mymensingh", district: "Mymensingh City", deliveryCharge: 120, estimatedDelivery: "48-72 Hours", isActive: true },
];

export const getDeliveryZones = async (_req: Request, res: Response): Promise<void> => {
  try {
    let zones = fallbackDeliveryZones;
    if (mongoose.connection.readyState === 1) {
      try {
        const dbZones = await DeliveryZone.find({ isActive: true }).sort({ division: 1, district: 1 }).maxTimeMS(2000);
        if (dbZones && dbZones.length > 0) {
          zones = dbZones as any;
        }
      } catch {
        // use fallback
      }
    }

    // Group districts by division
    const grouped = zones.reduce((acc: Record<string, any[]>, zone) => {
      if (!acc[zone.division]) {
        acc[zone.division] = [];
      }
      acc[zone.division].push({
        district: zone.district,
        deliveryCharge: zone.deliveryCharge,
        estimatedDelivery: zone.estimatedDelivery,
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        raw: zones,
        byDivision: grouped,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
