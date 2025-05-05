import mongoose, { Mongoose } from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedMongoose | undefined;
}

interface CachedMongoose {
  conn: Mongoose | null; // Connection of type Mongoose
  promise: Promise<Mongoose> | null; // Promise of connection or null
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose as CachedMongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
} else if (!cached.conn) {
  cached.conn = null;
  cached.promise = null;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
