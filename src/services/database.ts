import { connectMongo } from "@/utils/connectMongo";
import { InventoryDto } from "../types/dtos/Inventory.dto";
import { InventoryType } from "@/enum/enum";

export const updateInventory = async (inventory: InventoryDto, type: InventoryType): Promise<void> => {
    try {
        const database = await connectMongo();
        await database
            .collection("inventories")
            .updateOne(
                { prototype: inventory.prototype, owner: inventory.owner, type },
                { $set: { ...inventory } },
                { upsert: true }
            );
        return;
    } catch (error) {
        console.error(error);
    }
};
