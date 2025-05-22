import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link component from Next.js
import ThemeToggle from "./Theme/ThemeToggle";
import { useTheme } from "@/config/theme";
import { ConnectWallet } from "./ConnectWallet";
import Cart from "@/components/Cart/Cart";
import Bulk from "./Bulk/Bulk";

/**
 * @description Header component for the application.
 * @returns {JSX.Element}
 */
const Header = () => {
    const { theme } = useTheme();
    const NAVS = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "#contact", label: "Contact" },
        { href: "/plans", label: "Pricing" },
        { href: "/about", label: "About" },
        { href: "/console", label: "Console" }
    ];

    return (
        <nav
            style={{
                backgroundColor: theme.headerBackgroundColor,
                color: theme.headerTextColor,
                padding: "10px 20px",
                margin: "0px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "fixed",
                width: "100%",
                top: 0,
                boxSizing: "border-box",
                flexWrap: "wrap",
                zIndex: 1000
            }}
        >
            <Link href="/" passHref>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        style={{ marginRight: "10px" }}
                    />
                    <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>NFT Trading</div>
                </div>
            </Link>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexWrap: "wrap"
                }}
            >
                {NAVS.map((link, index) => (
                    <Link key={index} href={link.href} passHref style={{ margin: "0 10px" }}>
                        {link.label}
                    </Link>
                ))}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <ThemeToggle />
                <Bulk />
                <Cart />
                <ConnectWallet />
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
