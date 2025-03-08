import { MongoClient, Db } from "mongodb";
import { MONGO_URI } from "@/constants/constants";

const url = MONGO_URI;
const dbName = "MoboxProfitBot";

let db: Db | null = null;
export const connectMongo = async (): Promise<Db> => {
    if (db) return db;
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
    return db;
};
