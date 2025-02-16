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
                backgroundColor: theme.primaryColor,
                color: theme.buttonTextColor,
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "fixed",
                width: "100%",
                top: 0,
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
                <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Mobox Profit Bot</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <a
                    href="#home"
                    style={{
                        margin: "0 10px",
                        color: theme.buttonTextColor,
                        textDecoration: "none"
                    }}
                >
                    Home
                </a>
                <a
                    href="#features"
                    style={{
                        margin: "0 10px",
                        color: theme.buttonTextColor,
                        textDecoration: "none"
                    }}
                >
                    Features
                </a>
                <a
                    href="#contact"
                    style={{
                        margin: "0 10px",
                        color: theme.buttonTextColor,
                        textDecoration: "none"
                    }}
                >
                    Contact
                </a>
                <ThemeToggle />
                <ConnectWallet />
            </div>
        </nav>
    );
};

export default Header;
