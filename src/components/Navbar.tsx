import React from "react";
import ThemeToggle from "./Theme/ThemeToggle";
import { useTheme } from "@/config/theme";

const Navbar = () => {
    const { theme } = useTheme();

    return (
        <nav
            style={{
                backgroundColor: theme.primaryColor,
                color: theme.buttonTextColor,
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "fixed",
                width: "100%",
                top: 0,
                zIndex: 1000
            }}
        >
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Mobox Profit Bot</div>
            <ThemeToggle />
        </nav>
    );
};

export default Navbar;
