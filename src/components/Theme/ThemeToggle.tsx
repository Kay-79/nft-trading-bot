"use client";

import React, { useContext, useEffect, useState } from "react";
import { ThemeContext, customDarkTheme, customLightTheme } from "@/config/theme";
import { FaSun, FaMoon } from "react-icons/fa";

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
        <div onClick={toggleTheme} style={{ cursor: "pointer", marginLeft: "12px" }}>
            {theme.mode === "light" ? <FaMoon /> : <FaSun />}
        </div>
    );
};

export default ThemeToggle;
