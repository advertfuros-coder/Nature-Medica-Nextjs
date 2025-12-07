import mongoose from "mongoose";

// Support both MONGODB_URI and MONGO_URI
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// During build time, allow dummy connection or skip validation
const isBuildTime =
  process.env.NODE_ENV === "production" &&
  !process.env.VERCEL &&
  !global.mongoose;

if (!MONGODB_URI && !isBuildTime) {
  throw new Error(
    "Please define the MONGODB_URI or MONGO_URI environment variable"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Skip connection during build if no valid URI
  if (
    !MONGODB_URI ||
    MONGODB_URI.includes("localhost") ||
    MONGODB_URI.includes("dummy")
  ) {
    console.warn("⚠️  Skipping MongoDB connection (build time or invalid URI)");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
