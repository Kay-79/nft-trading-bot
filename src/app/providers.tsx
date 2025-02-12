"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { config } from "./wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const rainbowKitTheme = lightTheme();
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
