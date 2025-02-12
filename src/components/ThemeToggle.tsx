"use client";

import { useTheme } from "@/context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            {theme === "dark" ? (
                <FaMoon className="text-2xl text-gray-800" />
            ) : (
                <FaSun className="text-2xl text-gray-200" />
            )}
        </div>
    );
};

export default ThemeToggle;
