"use client";

import React from "react";
import { useTheme } from "@/config/theme";

const ThemedButton = ({
    children,
    onClick
}: {
    children: React.ReactNode;
    onClick: () => void;
}) => {
    const { theme } = useTheme();

    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: theme.buttonBackgroundColor,
                color: theme.buttonTextColor,
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            }}
        >
            {children}
        </button>
    );
};

export default ThemedButton;
