"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "./wagmi";
import { useTheme } from "@/context/ThemeContext";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const rainbowKitTheme = theme === "light" ? lightTheme() : darkTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
