import { Request, Response } from "express";
import mongoose from "mongoose";
import { DeliveryZone } from "../models/DeliveryZone";
import { ALL_64_DISTRICTS } from "../constants/districts";

export const getDeliveryZones = async (_req: Request, res: Response): Promise<void> => {
  try {
    let zones = ALL_64_DISTRICTS.map((d) => ({
      division: d.division,
      divisionBn: d.divisionBn,
      district: d.displayName,
      districtKey: d.district,
      districtBn: d.districtBn,
      deliveryCharge: d.deliveryCharge,
      estimatedDelivery: d.estimatedDelivery,
      isActive: true,
    }));

    if (mongoose.connection.readyState === 1) {
      try {
        const validNames = ALL_64_DISTRICTS.map((d) => d.displayName);
        // Clean up legacy generic entries if any exist
        await DeliveryZone.deleteMany({ district: { $nin: validNames } });

        const count = await DeliveryZone.countDocuments();
        // If not seeded with all 64 districts yet, bulk upsert them
        if (count < 64) {
          const bulkOps = ALL_64_DISTRICTS.map((d) => ({
            updateOne: {
              filter: { district: d.displayName },
              update: {
                $set: {
                  division: d.division,
                  district: d.displayName,
                  deliveryCharge: d.deliveryCharge,
                  estimatedDelivery: d.estimatedDelivery,
                  isActive: true,
                },
              },
              upsert: true,
            },
          }));
          await DeliveryZone.bulkWrite(bulkOps);
        }

        const dbZones = await DeliveryZone.find({ isActive: true }).sort({ division: 1, district: 1 }).maxTimeMS(2500);
        if (dbZones && dbZones.length === 64) {
          zones = dbZones as any;
        }
      } catch {
        // Fallback to in-memory ALL_64_DISTRICTS
      }
    }

    // Group districts by division
    const grouped = zones.reduce((acc: Record<string, any[]>, zone: any) => {
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
      totalCount: zones.length,
      data: {
        raw: zones,
        byDivision: grouped,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
