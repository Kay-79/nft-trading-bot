import { BulkAction } from "@/enum/enum";
import { InventoryDto } from "@/types/dtos/Inventory.dto";

interface BulkStorageState {
    bulkSellItems: InventoryDto[];
}

const initialState: BulkStorageState = {
    bulkSellItems: []
};

const bulkStorageReducer = (
    state = initialState,
    action: { type: BulkAction; payload: InventoryDto }
): BulkStorageState => {
    switch (action.type) {
        case BulkAction.ADD:
            return {
                ...state,
                bulkSellItems: [...state.bulkSellItems, action.payload]
            };
        case BulkAction.REMOVE:
            return {
                ...state,
                bulkSellItems: state.bulkSellItems.filter(item => item.id !== action.payload.id)
            };
        case BulkAction.UPDATE:
            return {
                ...state,
                bulkSellItems: state.bulkSellItems.map(item =>
                    item.id === action.payload.id ? action.payload : item
                )
            };
        case BulkAction.CLEAR:
            return {
                ...state,
                bulkSellItems: []
            };
        default:
            return state;
    }
};

export default bulkStorageReducer;
