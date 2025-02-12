"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { lightTheme, darkTheme, ThemeConfig } from "@/config/theme";

type Theme = "light" | "dark" | undefined;

interface ThemeContextProps {
    mode?: string;
    theme: ThemeConfig;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    mode: darkTheme.mode, // Default to darkTheme
    theme: darkTheme, // Default to darkTheme
    toggleTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(darkTheme.mode as Theme);

    const themeConfig = theme === lightTheme.mode ? lightTheme : darkTheme;

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === lightTheme.mode ? "dark" : "light"));
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
