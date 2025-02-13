import React from "react";
import { useTheme } from "@/config/theme";

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer
            style={{
                backgroundColor: theme.primaryColor,
                color: theme.buttonTextColor,
                padding: "10px 20px",
                textAlign: "center",
                position: "fixed",
                width: "100%",
                bottom: 0
            }}
        >
            <p>&copy; 2024 Mobox Profit Bot. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
