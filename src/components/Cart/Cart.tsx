"use client";

import { CartItemListStorage } from "@/store/reducers/cartStorageReducer";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";

const Cart = () => {
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const cartItems: CartItemListStorage[] = useSelector(
        (state: { cartStorage: { cartItems: CartItemListStorage[] } }) =>
            state.cartStorage.cartItems
    );
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleCart = () => {
        // open cart modal
        console.log("Cart clicked");
        // console.log(cartItems);
    };

    return (
        <div
            onClick={toggleCart}
            style={{
                cursor: "pointer",
                marginLeft: "6px",
                marginRight: "12px",
                position: "relative",
                fontSize: "20px",
            }}
        >
            <FaShoppingCart />
            {cartItems.length > 0 && (
                <span
                    style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        background: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "0px 5px",
                        fontSize: "10px",
                        fontWeight: "bold"
                    }}
                >
                    {cartItems.length}
                </span>
            )}
        </div>
    );
};

export default Cart;
