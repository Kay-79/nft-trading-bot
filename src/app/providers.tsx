"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "./wagmi";
import { ThemeContext, customLightTheme, ThemeConfig } from "@/config/theme";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeConfig>(customLightTheme);
    const rainbowKitTheme = darkTheme();

    useEffect(() => {
        document.body.style.backgroundColor = theme.backgroundColor;
        document.body.style.color = theme.textColor;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <QueryClientProvider client={queryClient}>
                {wagmiConfig ? (
                    <WagmiProvider config={wagmiConfig}>
                        <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
                    </WagmiProvider>
                ) : (
                    <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
                )}
            </QueryClientProvider>
        </ThemeContext.Provider>
    );
}
