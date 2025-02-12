"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { ThemeConfig, lightTheme, darkTheme } from "@/config/theme";

type Theme = "light" | "dark";

interface ThemeContextProps {
    theme: ThemeConfig;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: lightTheme, // Default to lightTheme
    toggleTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");

    const themeConfig = theme === "light" ? lightTheme : darkTheme;

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme: themeConfig, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
