"use client";

export interface ThemeConfig {
    mode: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    successColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    primaryButtonBackgroundColor: string; // New property for primary button background color
    primaryButtonTextColor: string; // New property for primary button text color
    secondaryButtonBackgroundColor: string; // New property for secondary button background color
    secondaryButtonTextColor: string; // New property for secondary button text color
    headerBackgroundColor?: string;
    headerTextColor?: string; // Text color for table headers
    footerBackgroundColor?: string;
    footerTextColor?: string;
}

export const customLightTheme: ThemeConfig = {
    mode: "light",
    primaryColor: "#3498db", // Blue
    secondaryColor: "#2ecc71", // Green
    backgroundColor: "#ecf0f1", // Light Grey
    textColor: "#2c3e50", // Dark Grey
    successColor: "#2ecc71", // Green
    buttonBackgroundColor: "#1abc9c", // New Button Background Color (Turquoise)
    buttonTextColor: "#ffffff", // White
    primaryButtonBackgroundColor: "#007bff", // Slightly Blue
    primaryButtonTextColor: "#ffffff", // White
    secondaryButtonBackgroundColor: "transparent", // Transparent
    secondaryButtonTextColor: "#dc3545", // Slightly Red
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
    successColor: "#2ecc71", // Green
    buttonBackgroundColor: "#66a085", // New Button Background Color (Dark Turquoise)
    buttonTextColor: "#ffffff", // White
    primaryButtonBackgroundColor: "#0056b3", // Slightly Dark Blue
    primaryButtonTextColor: "#ffffff", // White
    secondaryButtonBackgroundColor: "transparent", // Transparent
    secondaryButtonTextColor: "#c82333", // Slightly Dark Red
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
    theme: customLightTheme,
    setTheme: () => {}
});

export const useTheme = (): ThemeContextProps => useContext(ThemeContext);
