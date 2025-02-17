import React from "react";
import Image from "next/image";
import ThemeToggle from "./Theme/ThemeToggle";
import { useTheme } from "@/config/theme";
import { ConnectWallet } from "./ConnectWallet";

const Header = () => {
    const { theme } = useTheme();

    return (
        <nav
            style={{
                backgroundColor: theme.headerBackgroundColor,
                color: theme.headerTextColor,
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "fixed",
                width: "100%",
                top: 0,
                boxSizing: "border-box" // Ensure padding is included in the element's total width and height
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    style={{ marginRight: "10px" }}
                />
                <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>Mobox Profit Bot</div>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center",
                    fontSize: "1.2rem"
                }}
            >
                <a
                    href="#home"
                    style={{
                        margin: "0 10px",
                        textDecoration: "none"
                    }}
                >
                    Home
                </a>
                <a
                    href="#features"
                    style={{
                        margin: "0 10px",
                        textDecoration: "none"
                    }}
                >
                    Features
                </a>
                <a
                    href="#contact"
                    style={{
                        margin: "0 10px",
                        textDecoration: "none"
                    }}
                >
                    Contact
                </a>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <ConnectWallet />
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Header;
