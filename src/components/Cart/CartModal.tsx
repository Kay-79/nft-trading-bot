import React, { useState } from "react";
import { useTheme } from "@/config/theme";
import { RiCloseLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { CartItemListStorage } from "@/store/reducers/cartStorageReducer";
import { CartAction } from "@/enum/enum";
import ListingCard from "@/components/Card/ListingCard";
import PrimaryLoadingButton from "@/components/Button/PrimaryLoadingButton";
import { toast } from "react-toastify";

interface CartModalProps {
    onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [loadingBuy, setLoadingBuy] = useState(false);
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

    const handleRemove = (id: string) => {
        dispatch({ type: CartAction.REMOVE, payload: { id } });
    };

    const handleBuyAll = async () => {
        setLoadingBuy(true);
        try {
            if (cartItems.length === 0) {
                toast.error("Cart is empty!");
                setLoadingBuy(false);
                return;
            }
            await new Promise(res => setTimeout(res, 1000));
            dispatch({ type: CartAction.CLEAR });
            toast.success("Buy all successfully!");
            onClose();
        } catch {
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
                                marginTop: "15px"
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <ListingCard listing={item.listing} canAddToCart={false} />
                            </div>
                            <button
                                onClick={() => handleRemove(item.id)}
                                style={{
                                    marginLeft: 10,
                                    backgroundColor: "transparent",
                                    border: "none",
                                    color: theme.textColor,
                                    cursor: "pointer",
                                    fontSize: "18px"
                                }}
                                title="Remove"
                            >
                                <RiCloseLine />
                            </button>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "20px"
                    }}
                >
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
