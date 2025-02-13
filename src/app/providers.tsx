"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "./wagmi";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const rainbowKitTheme = darkTheme();
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem={true}>
                {wagmiConfig ? (
                    <WagmiProvider config={wagmiConfig}>
                        <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
                    </WagmiProvider>
                ) : (
                    <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
                )}
            </ThemeProvider>
        </QueryClientProvider>
    );
}
