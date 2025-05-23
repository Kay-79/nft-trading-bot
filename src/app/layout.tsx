"use client";

import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/config/theme";
import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RootLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <html
            lang="en"
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                minHeight: "100vh" // Ensure html takes full viewport height
            }}
        >
            <head>
                <title>NFT Trading</title>
            </head>
            <body
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    minHeight: "100vh", // Ensure body takes full viewport height
                    margin: 0,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Providers>
                    <ErrorBoundary>
                        <Header />
                        <div style={{ minHeight: "95vh", paddingTop: "10vh" }}>
                            <main
                                style={{
                                    backgroundColor: theme.backgroundColor,
                                    color: theme.textColor,
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                {children}
                            </main>
                        </div>
                        <Footer />
                    </ErrorBoundary>
                    <ToastContainer style={{ top: "75px" }} />
                </Providers>
            </body>
        </html>
    );
}

export default RootLayout;
