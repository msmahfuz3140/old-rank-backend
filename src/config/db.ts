import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/oldrank";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    
    // Auto-seed initial store products and categories if MongoDB is fresh
    const { seedIfEmpty } = await import("../services/seedService");
    await seedIfEmpty();
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection issue (${error.message}). Running with fallback.`);
  }
};
