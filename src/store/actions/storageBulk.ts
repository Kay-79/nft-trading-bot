import { BulkAction } from "@/enum/enum";
import { BulkItemListStorage } from "@/store/reducers/bulkStorageReducer";

export const addItemToBulk = (item: BulkItemListStorage) => ({
    type: BulkAction.ADD,
    payload: item
});

export const removeItemFromBulk = (item: BulkItemListStorage) => ({
    type: BulkAction.REMOVE,
    payload: item
});

export const updateItemInBulk = (item: BulkItemListStorage) => ({
    type: BulkAction.UPDATE,
    payload: item
});

export const clearBulk = () => ({
    type: BulkAction.CLEAR
});
