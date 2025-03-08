import { Inventory } from "../types/dtos/Inventory.dto";
import { MongoClient, Db } from "mongodb";
import { DATABASE_URL } from "@/constants/constants";
import { InventoryType } from "@/enum/enum";

const url = DATABASE_URL;
const dbName = "MoboxProfitBot";

let db: Db | null = null;
const connectToDatabase = async (): Promise<Db> => {
    if (db) return db;
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
    return db;
};

export const updateInventory = async (inventory: Inventory, type: InventoryType): Promise<void> => {
    const database = await connectToDatabase();
    await database
        .collection("inventories")
        .updateOne({ type }, { $set: inventory }, { upsert: true, bypassDocumentValidation: true });
};
