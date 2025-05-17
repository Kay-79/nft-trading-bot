import { AuctionDto } from "@/types/dtos/Auction.dto";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { CartAction } from "@/enum/enum";

interface AddToCartIconProps {
    listing: AuctionDto;
    onAddToCart: (listing: AuctionDto, e?: React.MouseEvent) => void;
}

const AddToCartIcon: React.FC<AddToCartIconProps> = ({ listing, onAddToCart }) => {
    const dispatch = useDispatch();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: CartAction.ADD,
            payload: {
                id: listing.id,
                listing
            }
        });
        onAddToCart(listing, e);
    };

    return (
        <div
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer"
            onClick={handleClick}
        >
            <FaCartPlus className="text-gray-800" size={24} />
        </div>
    );
};

export default AddToCartIcon;
