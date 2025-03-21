import { BulkAction } from "@/enum/enum";
import { InventoryDto } from "@/types/dtos/Inventory.dto";

export const addItemToBulk = (item: InventoryDto) => ({
    type: BulkAction.ADD,
    payload: item
});

export const removeItemFromBulk = (item: InventoryDto) => ({
    type: BulkAction.REMOVE,
    payload: item
});

export const clearBulk = () => ({
    type: BulkAction.CLEAR
});
