import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
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
import uploadRoutes from "./routes/uploadRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import reviewRoutes from "./routes/reviewRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
const allowedOrigins = [
  // Local Development
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  // Production
  "https://www.oldrankbd.com",
  "https://oldrankbd.com",
  "https://old-rank-frontend.vercel.app",
  // Dynamic from env (Vercel preview deployments etc.)
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow any *.vercel.app preview URL for this project
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Ensure database is connected before handling any API routes
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
});

// Health Check
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "Old Rank API Server",
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
    },
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
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/reviews", reviewRoutes);

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
