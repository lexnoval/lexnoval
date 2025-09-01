// lib/db.ts
import mongoose from 'mongoose';

let cached = (global as any)._mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } 
           || { conn: null, promise: null };

export async function dbConnect(uri = process.env.MONGODB_URI!) {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    if (!uri) throw new Error('Missing MONGODB_URI');
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false, maxPoolSize: 10 })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  (global as any)._mongoose = cached; // hot-reload için cache
  return cached.conn;
}
