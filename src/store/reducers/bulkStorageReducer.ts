import { BulkAction } from "@/enum/enum";
import { InventoryDto } from "@/types/dtos/Inventory.dto";

interface BulkStorageState {
    items: InventoryDto[];
}

const initialState: BulkStorageState = {
    items: []
};

const bulkStorageReducer = (
    state = initialState,
    action: { type: BulkAction; payload: InventoryDto }
): BulkStorageState => {
    switch (action.type) {
        case BulkAction.ADD:
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        case BulkAction.REMOVE:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id)
            };
        case BulkAction.UPDATE:
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? action.payload : item
                )
            };
        case BulkAction.CLEAR:
            return {
                ...state,
                items: []
            };
        default:
            return state;
    }
};

export default bulkStorageReducer;
