import mongoose from 'mongoose';

/**
 * Global MongoDB/Mongoose connection with caching.
 *
 * In serverless environments (Vercel, etc.) each function invocation
 * may spin up a new process. Without caching the connection on `global`,
 * every request would open a new connection, quickly exhausting the
 * MongoDB connection pool.
 *
 * In development, hot module reloading can also cause re-imports.
 * The global cache prevents "OverwriteModelError" and connection leaks.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local\n' +
      'Example: MONGODB_URI=mongodb://localhost:27017/sis-erp',
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* eslint-disable no-var */
declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

/**
 * Connects to MongoDB and returns the cached Mongoose instance.
 * Safe to call multiple times — only the first call creates a connection.
 */
async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
