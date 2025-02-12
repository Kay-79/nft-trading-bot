"use client";

import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return <button onClick={toggleTheme}>{theme === "light" ? "Light" : "Dark"} Mode</button>;
};

export default ThemeToggle;
