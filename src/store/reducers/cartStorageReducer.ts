import { CartAction } from "@/enum/enum";
import { AuctionDto } from "@/types/dtos/Auction.dto";

export interface CartItemListStorage {
    id: string;
    listing: AuctionDto;
}

interface CartStorageState {
    cartItems: CartItemListStorage[];
}

const initialState: CartStorageState = {
    cartItems: []
};

const bulkStorageReducer = (
    state = initialState,
    action: { type: CartAction; payload: CartItemListStorage }
): CartStorageState => {
    switch (action.type) {
        case CartAction.ADD:
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload]
            };
        case CartAction.REMOVE:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload.id)
            };
        case CartAction.UPDATE:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id ? action.payload : item
                )
            };
        case CartAction.CLEAR:
            return {
                ...state,
                cartItems: []
            };
        default:
            return state;
    }
};

export default bulkStorageReducer;
