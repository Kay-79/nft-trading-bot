"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, lightTheme, Theme } from "@rainbow-me/rainbowkit";
import { Provider as ReduxProvider } from "react-redux";
import { wagmiConfig } from "./wagmi";
import { ThemeContext, customDarkTheme, customLightTheme, ThemeConfig } from "@/config/theme";
import store from "@/store";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeConfig>(customDarkTheme || customLightTheme);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(JSON.parse(savedTheme));
        }
    }, []);

    const rainbowKitTheme: Theme = theme.mode === "light" ? lightTheme() : darkTheme();

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme));
        document.body.style.backgroundColor = theme.backgroundColor;
        document.body.style.color = theme.textColor;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <QueryClientProvider client={queryClient}>
                <ReduxProvider store={store}>
                    {wagmiConfig ? (
                        <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
                            <RainbowKitProvider theme={rainbowKitTheme}>
                                {children}
                            </RainbowKitProvider>
                        </WagmiProvider>
                    ) : (
                        <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
                    )}
                </ReduxProvider>
            </QueryClientProvider>
        </ThemeContext.Provider>
    );
}
