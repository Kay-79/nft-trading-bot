"use client";

import React from "react";
import { useTheme } from "@/config/theme";

const LandingPage = () => {
    const { theme } = useTheme();

    return (
        <div
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                textAlign: "center"
            }}
        >
            <h1 style={{ color: theme.primaryColor, fontSize: "3rem" }}>Coming Soon</h1>
            <p style={{ fontSize: "1.2rem" }}>
                {"We're working hard to bring you something amazing. Stay tuned!"}
            </p>
        </div>
    );
};

export default LandingPage;
