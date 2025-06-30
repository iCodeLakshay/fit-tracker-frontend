import { MongoClient } from 'mongodb';

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options = {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.NEXT_AUTH_MONGO_DB_URL) {
    throw new Error("Please add MongoDB URI to env file");
}

const uri = process.env.NEXT_AUTH_MONGO_DB_URL;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;