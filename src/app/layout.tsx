"use client";

import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/config/theme";

function RootLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <html lang="en">
            <body style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                <Navbar />
                <Providers>
                    <div style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, minHeight: '100vh' }}>
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}

export default RootLayout;
