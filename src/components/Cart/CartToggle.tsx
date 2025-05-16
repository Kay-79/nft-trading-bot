"use client";

import React, { useEffect, useState } from "react";
import { FaMoon, FaShoppingCart } from "react-icons/fa";

const CartToggle = () => {
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

export default CartToggle;
