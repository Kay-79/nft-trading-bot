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
    headerBackgroundColor?: string;
    headerTextColor?: string;
    footerBackgroundColor?: string;
    footerTextColor?: string;
}

export const customLightTheme: ThemeConfig = {
    mode: "light",
    primaryColor: "#3498db", // Blue
    secondaryColor: "#2ecc71", // Green
    backgroundColor: "#ecf0f1", // Light Grey
    textColor: "#2c3e50", // Dark Grey
    buttonBackgroundColor: "#e74c3c", // Red
    buttonTextColor: "#ffffff", // White
    headerBackgroundColor: "#3498db", // Blue
    headerTextColor: "#ffffff", // White
    footerBackgroundColor: "#3498db", // Blue
    footerTextColor: "#ffffff" // White
};

export const customDarkTheme: ThemeConfig = {
    mode: "dark",
    primaryColor: "#2980b9", // Dark Blue
    secondaryColor: "#27ae60", // Dark Green
    backgroundColor: "#2c3e50", // Dark Grey
    textColor: "#ecf0f1", // Light Grey
    buttonBackgroundColor: "#c0392b", // Dark Red
    buttonTextColor: "#ffffff", // White
    headerBackgroundColor: "#2980b9", // Dark Blue
    headerTextColor: "#ffffff", // White
    footerBackgroundColor: "#2980b9", // Dark Blue
    footerTextColor: "#ffffff" // White
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
