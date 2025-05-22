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
    const [themeRainbow, setThemeRainbow] = useState<Theme>(darkTheme() || lightTheme());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            const parsedTheme = JSON.parse(savedTheme);
            setTheme(parsedTheme === "light" ? customLightTheme : customDarkTheme);
            setThemeRainbow(parsedTheme === "light" ? lightTheme() : darkTheme());
        } else {
            setTheme(customDarkTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme.mode));
        document.body.style.backgroundColor = theme.backgroundColor;
        document.body.style.color = theme.textColor;
    }, [theme]);

    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <QueryClientProvider client={queryClient}>
                <ReduxProvider store={store}>
                    {wagmiConfig ? (
                        <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
                            <RainbowKitProvider theme={themeRainbow}>{children}</RainbowKitProvider>
                        </WagmiProvider>
                    ) : (
                        <RainbowKitProvider theme={themeRainbow}>{children}</RainbowKitProvider>
                    )}
                </ReduxProvider>
            </QueryClientProvider>
        </ThemeContext.Provider>
    );
}
