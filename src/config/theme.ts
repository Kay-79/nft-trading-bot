"use client";

// src/config/theme.ts
export interface ThemeConfig {
    mode: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
}

export const customLightTheme: ThemeConfig = {
    mode: "light",
    primaryColor: "#007bff",
    secondaryColor: "#6c757d",
    backgroundColor: "#f8f9fa",
    textColor: "#212529",
    buttonBackgroundColor: "#007bff",
    buttonTextColor: "#ffffff"
};

export const customDarkTheme: ThemeConfig = {
    mode: "dark",
    primaryColor: "#00a3ff",
    secondaryColor: "#a7b1b8",
    backgroundColor: "#212529",
    textColor: "#f8f9fa",
    buttonBackgroundColor: "#00a3ff",
    buttonTextColor: "#000000"
};

export const themes = {
    light: customLightTheme,
    dark: customDarkTheme
};

import { createContext, useContext } from "react";

export interface ThemeContextProps {
    theme: ThemeConfig;
    setTheme: (theme: ThemeConfig) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
    theme: customLightTheme, // Default theme
    setTheme: () => {} // Dummy function
});

export const useTheme = () => useContext(ThemeContext);
