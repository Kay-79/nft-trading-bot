import React, { useEffect, useState } from "react";
import { useTheme } from "@/config/theme";

const Footer = () => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const isBottom = scrollTop + windowHeight >= documentHeight - 50;
            setIsVisible(isBottom);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <footer
            style={{
                backgroundColor: theme.primaryColor,
                color: theme.buttonTextColor,
                padding: "10px 20px",
                textAlign: "center",
                position: "fixed",
                width: "100%",
                bottom: isVisible ? 0 : "-50px",
                transition: "bottom 0.3s"
            }}
        >
            <p>&copy; 2024 Mobox Profit Bot. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
