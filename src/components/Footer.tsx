import React from "react";
import { useTheme } from "@/config/theme";
import packageJson from "../../package.json";

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer
            style={{
                backgroundColor: theme.footerBackgroundColor,
                color: theme.footerTextColor,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
                zIndex: 1000,
                maxHeight: "5vh",
                minHeight: "5vh",
                bottom: 0,
                overflow: "hidden"
            }}
        >
            <p style={{ margin: 0 }}>
                &copy; 2024 NFT Trading. All rights reserved. Version: {packageJson.version}
            </p>
        </footer>
    );
};

export default Footer;
