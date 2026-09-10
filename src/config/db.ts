import mongoose from "mongoose";

let isConnected = false;

// Disable Mongoose query buffering so operations return instantly instead of hanging for 10 seconds
mongoose.set("bufferCommands", false);

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/oldrank";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    
    // Auto-seed initial store products and categories if MongoDB is fresh
    import("../services/seedService").then(({ seedIfEmpty }) => {
      seedIfEmpty();
    }).catch(() => {});
  } catch (error: any) {
    console.warn(`⚠️ MongoDB offline or unreachable (${error.message}). App running in high-speed in-memory mode.`);
  }
};
