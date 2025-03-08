import { MongoClient, Db } from "mongodb";
import { MONGO_URI } from "@/constants/constants";

const url = MONGO_URI;
const dbName = "MoboxProfitBot";

let db: Db | null = null;
let client: MongoClient | null = null;

export const connectMongo = async (): Promise<Db> => {
    if (db) {
        console.log("Reusing existing MongoDB connection");
        return db;
    }
    try {
        client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        console.log("Connected to MongoDB");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        if (client) {
            await client.close();
            console.log("MongoDB connection closed due to error");
        }
        throw error;
    }
};

export const closeMongoConnection = async (): Promise<void> => {
    if (client) {
        await client.close();
        console.log("MongoDB connection closed");
        client = null;
        db = null;
    }
};
