import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose | null> | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  const mongoUri =
    process.env.MONGODB_URI ||
    "mongodb+srv://old-rank:oldrank3140@cluster0.bxwan4t.mongodb.net/old-rank?retryWrites=true&w=majority&appName=Cluster0";

  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

      // Auto-seed initial store products and categories if MongoDB is completely empty
      try {
        const { seedIfEmpty } = await import("../services/seedService");
        await seedIfEmpty();
      } catch (seedErr: any) {
        console.warn(`Seed check note: ${seedErr.message}`);
      }

      return conn;
    } catch (error: any) {
      console.error(`❌ MongoDB connection issue: ${error.message}`);
      return null;
    } finally {
      connectionPromise = null;
    }
  })();

  await connectionPromise;
};

