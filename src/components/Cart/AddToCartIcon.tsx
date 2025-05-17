import { AuctionDto } from "@/types/dtos/Auction.dto";
import { FaCartPlus } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { customDarkTheme } from "@/config/theme";
import { CartItemListStorage } from "@/store/reducers/cartStorageReducer";
import { addItemToCart, removeItemFromCart } from "@/store/actions/storageCart";

interface AddToCartIconProps {
    listing: AuctionDto;
}

const AddToCartIcon: React.FC<AddToCartIconProps> = ({ listing }) => {
    const cartItems: CartItemListStorage[] = useSelector(
        (state: { cartStorage: { cartItems: CartItemListStorage[] } }) =>
            state.cartStorage.cartItems
    );
    const isInCart = cartItems.some(item => item.id === listing.id);
    const dispatch = useDispatch();
    const cartItem: CartItemListStorage = {
        id: listing.id || "",
        listing: listing
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInCart) {
            dispatch(removeItemFromCart(cartItem));
        } else {
            dispatch(addItemToCart(cartItem));
        }
    };

    return (
        <div
            onClick={handleAddToCart}
            style={{
                color: isInCart ? customDarkTheme.successColor : customDarkTheme.textColor
            }}
        >
            {isInCart ? <IoBagCheckOutline size={20} /> : <FaCartPlus size={20} />}
        </div>
    );
};

export default AddToCartIcon;
