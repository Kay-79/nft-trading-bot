"use client";

import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        setTheme(localStorage.getItem("theme") || "light");
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("theme", theme);
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return <button onClick={toggleTheme}>{theme === "light" ? "Dark" : "Light"} Mode</button>;
};

export default ThemeToggle;
