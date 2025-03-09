// import { closeMongoConnection } from "@/utils/connectMongo";
import { connectMongo } from "@/utils/connectMongo";
import { InventoryDto } from "../types/dtos/Inventory.dto";
import { InventoryType } from "@/enum/enum";

export const updateInventory = async (
    inventory: InventoryDto,
    type: InventoryType
): Promise<void> => {
    try {
        console.log("Connecting to MongoDB...");
        const database = await connectMongo();
        console.log("Updating inventory...");
        const existingInventory = await database.collection("inventories").findOne({
            id: inventory.id,
            prototype: inventory.prototype,
            owner: inventory.owner,
            type
        });
        if (existingInventory) {
            await database.collection("inventories").updateOne(
                {
                    id: inventory.id,
                    prototype: inventory.prototype,
                    owner: inventory.owner,
                    type
                },
                { $inc: { amount: 1 } }
            );
            console.log("Normal inventory amount incremented successfully");
        } else {
            await database.collection("inventories").updateOne(
                {
                    id: inventory.id,
                    prototype: inventory.prototype,
                    owner: inventory.owner,
                    type
                },
                { $set: { ...inventory } },
                { upsert: true }
            );
            console.log("Normal inventory updated successfully");
        }
    } catch (error) {
        console.error("Error updating inventory:", error);
    }
};
