"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
    RainbowKitProvider,
    darkTheme,
    lightTheme,
    Theme,
    AuthenticationStatus,
    RainbowKitAuthenticationProvider,
    createAuthenticationAdapter
} from "@rainbow-me/rainbowkit";
import { Provider as ReduxProvider } from "react-redux";
import { wagmiConfig } from "./wagmi";
import { ThemeContext, customDarkTheme, customLightTheme, ThemeConfig } from "@/config/theme";
import store from "@/store";
import { createSiweMessage } from "viem/siwe";

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

    const fetchingStatusRef = useRef(false);
    const verifyingRef = useRef(false);
    const [authStatus, setAuthStatus] = useState<AuthenticationStatus>("loading");

    useEffect(() => {
        const fetchStatus = async () => {
            if (fetchingStatusRef.current || verifyingRef.current) {
                return;
            }

            fetchingStatusRef.current = true;

            try {
                const response = await fetch("/api/auth/me");
                if (!response.ok) {
                    setAuthStatus("unauthenticated");
                } else {
                    const json = await response.json();
                    setAuthStatus(json.address ? "authenticated" : "unauthenticated");
                }
            } catch {
                setAuthStatus("unauthenticated");
            } finally {
                fetchingStatusRef.current = false;
            }
        };

        fetchStatus();

        window.addEventListener("focus", fetchStatus);
        return () => window.removeEventListener("focus", fetchStatus);
    }, []);

    const authAdapter = useMemo(() => {
        return createAuthenticationAdapter({
            getNonce: async () => {
                const response = await fetch("/api/auth/nonce");
                return await response.text();
            },

            createMessage: ({ nonce, address, chainId }) => {
                return createSiweMessage({
                    domain: window.location.host,
                    address,
                    statement: "Sign in with Ethereum to the app.",
                    uri: window.location.origin,
                    version: "1",
                    chainId,
                    nonce
                });
            },

            verify: async ({ message, signature }) => {
                verifyingRef.current = true;

                try {
                    const response = await fetch("/api/auth/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message, signature })
                    });

                    const authenticated = Boolean(response.ok);

                    if (authenticated) {
                        setAuthStatus(authenticated ? "authenticated" : "unauthenticated");
                    }

                    return authenticated;
                } catch (error) {
                    console.error("Error verifying signature", error);
                    return false;
                } finally {
                    verifyingRef.current = false;
                }
            },

            signOut: async () => {
                setAuthStatus("unauthenticated");
                await fetch("/api/auth/logout");
            }
        });
    }, []);

    if (!mounted || authStatus === "loading") {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <QueryClientProvider client={queryClient}>
                <ReduxProvider store={store}>
                    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
                        <RainbowKitAuthenticationProvider adapter={authAdapter} status={authStatus}>
                            <RainbowKitProvider theme={themeRainbow}>{children}</RainbowKitProvider>
                        </RainbowKitAuthenticationProvider>
                    </WagmiProvider>
                </ReduxProvider>
            </QueryClientProvider>
        </ThemeContext.Provider>
    );
}
