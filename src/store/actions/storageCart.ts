import { CartAction } from "@/enum/enum";
import { CartItemListStorage } from "../reducers/cartStorageReducer";

export const addItemToCart = (item: CartItemListStorage) => ({
    type: CartAction.ADD,
    payload: item
});

export const removeItemFromCart = (item: CartItemListStorage) => ({
    type: CartAction.REMOVE,
    payload: item
});

export const updateItemInCart = (item: CartItemListStorage) => ({
    type: CartAction.UPDATE,
    payload: item
});

export const clearCart = () => ({
    type: CartAction.CLEAR
});
