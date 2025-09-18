import React, { useState } from "react";
import { useTheme } from "@/config/theme";
import { RiCloseLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { CartItemListStorage } from "@/store/reducers/cartStorageReducer";
import { CartAction } from "@/enum/enum";
import PrimaryLoadingButton from "@/components/Button/PrimaryLoadingButton";
import { toast } from "react-toastify";
import CartRow from "./CartRow";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { mpContractService } from "@/services/mpContract";
import { useAccount } from "wagmi";

interface CartModalProps {
    onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const { address } = useAccount();
    const [loadingBuy, setLoadingBuy] = useState(false);
    const [ignoreSold, setIgnoreSold] = useState(false);
    const cartItems: CartItemListStorage[] = useSelector(
        (state: { cartStorage: { cartItems: CartItemListStorage[] } }) =>
            state.cartStorage.cartItems
    );

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleClearAll = () => {
        dispatch({ type: CartAction.CLEAR });
    };

    const handleRemove = (listing: AuctionDto) => {
        dispatch({ type: CartAction.REMOVE, payload: { id: listing.id } });
    };

    const handleBuyAll = async () => {
        setLoadingBuy(true);
        try {
            if (cartItems.length === 0) {
                toast.error("Cart is empty!");
                setLoadingBuy(false);
                return;
            }
            await mpContractService.bidAuctions(
                cartItems.map(item => item.listing),
                address,
                ignoreSold
            );
            toast.success("Buy successful!");
            dispatch({ type: CartAction.CLEAR });
            onClose();
        } catch (error) {
            const errorMessage = (error as Error).message || "Buy failed!";
            console.error("Buy failed:", errorMessage);
            toast.error("Buy failed!");
        } finally {
            setLoadingBuy(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
            }}
            onClick={handleOutsideClick}
        >
            <div
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    padding: "20px",
                    borderRadius: "10px",
                    width: "80%",
                    maxWidth: "500px",
                    position: "relative",
                    fontSize: "16px"
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: theme.textColor
                    }}
                >
                    <RiCloseLine />
                </button>
                <h1
                    style={{
                        textAlign: "center",
                        fontSize: "20px" /* đồng bộ với BulkSellModal */
                    }}
                >
                    Cart
                </h1>
                <button
                    onClick={handleClearAll}
                    style={{
                        position: "absolute",
                        top: "25px",
                        right: "50px",
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "14px",
                        cursor: "pointer",
                        color: theme.textColor,
                        textDecoration: "underline"
                    }}
                >
                    Clear All
                </button>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {cartItems.length === 0 && (
                        <div style={{ textAlign: "center", marginTop: 20, fontSize: "16px" }}>
                            Cart is empty.
                        </div>
                    )}
                    {cartItems.map((item, index) => (
                        <div
                            key={item.id + index}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "0px"
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <CartRow
                                    key={item.id}
                                    listing={item?.listing}
                                    onRemove={handleRemove}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginTop: "20px"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="checkbox"
                            id="ignoreSold"
                            checked={ignoreSold}
                            onChange={e => setIgnoreSold(e.target.checked)}
                            style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="ignoreSold" style={{ cursor: "pointer" }}>
                            Ignore sold items and continue buying
                        </label>
                    </div>
                    <PrimaryLoadingButton
                        onClick={handleBuyAll}
                        loading={loadingBuy}
                        style={{
                            width: "100%",
                            padding: "10px 20px",
                            backgroundColor: theme.buttonBackgroundColor,
                            color: theme.buttonTextColor,
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            textAlign: "center",
                            fontSize: "16px"
                        }}
                    >
                        Buy All
                    </PrimaryLoadingButton>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
