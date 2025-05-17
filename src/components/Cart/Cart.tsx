"use client";

import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

const Cart = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleCart = () => {};

    return (
        <div
            onClick={toggleCart}
            style={{ cursor: "pointer", marginLeft: "6px", marginRight: "12px" }}
        >
            <FaShoppingCart />
        </div>
    );
};

export default Cart;
