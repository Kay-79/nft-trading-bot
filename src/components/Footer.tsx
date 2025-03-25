import React from "react";
import { useTheme } from "@/config/theme";

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer
            style={{
                backgroundColor: theme.footerBackgroundColor,
                color: theme.footerTextColor,
                padding: "10px 20px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box", // Ensure padding is included in the element's total width and height
                zIndex: 1000
            }}
        >
            <p style={{ margin: 0 }}>&copy; 2024 Mobox Profit Bot. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
