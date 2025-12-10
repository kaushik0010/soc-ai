// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in environment variables");
}

// Declare global type for caching
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

// Initialize cache (guaranteed non-undefined after this)
const cached =
  global.mongooseCache ??
  (global.mongooseCache = { conn: null, promise: null });

export async function connectDB() {
  // If already connected → return immediately
  if (cached.conn) return cached.conn;

  // If no connection promise → create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "soc-ai" });
  }

  // Wait for connection and store it
  cached.conn = await cached.promise;
  return cached.conn;
}
