import { Inventory } from "../types/dtos/Inventory.dto";

// MongoDB configuration
const url = DATABASE_URL;
const dbName = "mobox";
import { MongoClient, Db } from "mongodb";

let db: Db;
// Connect to MongoDB
async function connectToDatabase() {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
}

// Call the connect function to establish the connection
connectToDatabase().catch(console.error);

// ...existing code...

import { DATABASE_URL } from "@/constants/constants";

export async function updateInventory(inventory: Inventory): Promise<void> {
    const {
        prototype,
        owner,
        amount,
        tokenId,
        quality,
        category,
        level,
        specialty,
        hashrate,
        lvHashrate,
        tokens
    } = inventory;

    const inventoryUpdate: Inventory = {
        prototype,
        owner,
        amount,
        tokenId,
        quality,
        category,
        level,
        specialty,
        hashrate,
        lvHashrate,
        tokens
    };

    await db
        .collection("inventory")
        .updateOne(
            { tokenId: inventoryUpdate.tokenId },
            { $set: inventoryUpdate },
            { upsert: true }
        );
}

