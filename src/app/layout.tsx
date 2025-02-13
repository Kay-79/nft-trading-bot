"use client";

import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/config/theme";

function RootLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <html lang="en" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
            <body style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                <Providers>
                    <Navbar />
                    <div
                        style={{
                            backgroundColor: theme.backgroundColor,
                            color: theme.textColor,
                            minHeight: "100vh",
                            paddingTop: "60px", // Ensure content doesn't overlap with navbar
                            paddingBottom: "50px" // Ensure content doesn't overlap with footer
                        }}
                    >
                        {children}
                    </div>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}

export default RootLayout;
