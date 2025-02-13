"use client";

import React, { useContext, useEffect, useState } from "react";
import { ThemeContext, customDarkTheme, customLightTheme } from "@/config/theme";

const ThemeToggle = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        setTheme(theme.mode === "light" ? customDarkTheme : customLightTheme);
    };

    return (
        <button onClick={toggleTheme}>
            {theme.mode === "light" ? "Dark" : "Light"} Mode
        </button>
    );
};

export default ThemeToggle;
