import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Set up connection event listeners
if (typeof window === 'undefined') {
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB: Connection established');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB: Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB: Connection disconnected');
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔌 MongoDB: Connection closed due to app termination');
    process.exit(0);
  });
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('✅ MongoDB: Using existing connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 MongoDB: Attempting to connect...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB: Connected successfully');
      console.log(`📊 MongoDB: Database: ${mongoose.connection.db?.databaseName || 'unknown'}`);
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB: Connection failed');
      console.error('Error details:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e: any) {
    cached.promise = null;
    console.error('❌ MongoDB: Connection error:', e?.message || 'Unknown error');
    throw e;
  }
}

export default connectDB;

