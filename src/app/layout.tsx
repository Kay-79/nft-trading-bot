"use client";

import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/config/theme";

function RootLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <html lang="en" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
            <head>
                <title>Mobox Profit Bot</title>
            </head>
            <body style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                <Providers>
                    <Header />
                    <div
                        style={{
                            backgroundColor: theme.backgroundColor,
                            color: theme.textColor,
                            minHeight: "100vh",
                            display: "flex",
                            flexDirection: "column",
                            paddingTop: "60px", // Ensure content doesn't overlap with Header
                            boxSizing: "border-box" // Ensure padding is included in the element's total width and height
                        }}
                    >
                        <main style={{ flex: 1 }}>{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}

export default RootLayout;
