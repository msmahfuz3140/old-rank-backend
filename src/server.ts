import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";

// Route imports
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import incompleteOrderRoutes from "./routes/incompleteOrderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import couponRoutes from "./routes/couponRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import notificationRoutes from "./routes/notificationRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health Check
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "Shop Genie Next API",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
});

// API Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/incomplete-orders", incompleteOrderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/delivery", deliveryRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "API রুট খুঁজে পাওয়া যায়নি" });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "অভ্যন্তরীণ সার্ভার ত্রুটি",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Shop Genie API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/v1/health`);
});
