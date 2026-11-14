import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
}

// Keep a single client across hot reloads in development.
const globalForMongo = globalThis;
const client =
    globalForMongo.__hireloopMongoClient ??
    new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
    globalForMongo.__hireloopMongoClient = client;
}

const db = client.db(process.env.AUTH_DB_NAME || "hireloop_auth_db");

export { client, db };
