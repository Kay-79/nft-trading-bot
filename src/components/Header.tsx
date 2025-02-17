import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link component from Next.js
import ThemeToggle from "./Theme/ThemeToggle";
import { useTheme } from "@/config/theme";
import { ConnectWallet } from "./ConnectWallet";

/**
 * @description Header component for the application.
 * @returns {JSX.Element}
 */
const Header = () => {
    // Access the current theme
    const { theme } = useTheme();

    return (
        // Navigation bar with dynamic background and text color based on the theme
        <nav
            style={{
                backgroundColor: theme.headerBackgroundColor,
                color: theme.headerTextColor,
                padding: "10px 20px",
                margin: "0px 0", // Add margin to the navigation bar
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "fixed",
                width: "100%",
                top: 0,
                boxSizing: "border-box", // Ensure padding is included in the element's total width and height
                flexWrap: "wrap" // Allow wrapping for smaller screens
            }}
        >
            {/* Logo and title */}
            <Link href="/" passHref>
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
            </Link>
            {/* Navigation links */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexWrap: "wrap" // Allow wrapping for smaller screens
                }}
            >
                <Link href="/dashboard" passHref style={{ margin: "0 10px" }}>
                    Dashboard
                </Link>
                <Link href="#contact" passHref style={{ margin: "0 10px" }}>
                    Contact
                </Link>
                <Link href="/plans" passHref style={{ margin: "0 10px" }}>
                    Pricing
                </Link>
                <Link href="/about" passHref style={{ margin: "0 10px" }}>
                    About
                </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <ConnectWallet />
                <ThemeToggle />
            </div>
            <style jsx>{`
                @media (max-width: 768px) {
                    nav {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    div {
                        justify-content: flex-start;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Header;
