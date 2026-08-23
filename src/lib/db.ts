import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    mongoServer: MongoMemoryServer | null;
  };
}

let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null, mongoServer: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      let uri = process.env.MONGODB_URI;

      if (!uri) {
        if (!cached.mongoServer) {
          console.log("[DB] Initializing in-memory MongoDB Server...");
          cached.mongoServer = await MongoMemoryServer.create({
            instance: {
              dbName: "medici_accounting_db",
            },
          });
        }
        uri = cached.mongoServer.getUri();
        console.log(`[DB] Connected to in-memory MongoDB at ${uri}`);
      } else {
        console.log(`[DB] Connecting to MongoDB at ${uri}`);
      }

      const opts = {
        bufferCommands: false,
      };

      return mongoose.connect(uri, opts);
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
