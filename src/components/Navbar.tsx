import React from "react";
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    return (
        <nav className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between">
            <div className="text-black dark:text-white font-bold">My Website</div>
            <ThemeToggle />
        </nav>
    );
};

export default Navbar;
