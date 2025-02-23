"use client";

import React from "react";
import { useTheme } from "@/config/theme";

interface ErrorPageProps {
    error: Error;
    reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
    const { theme } = useTheme();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                textAlign: "center"
            }}
        >
            <h1>Something went wrong</h1>
            <p>{error.message}</p>
            <button
                onClick={reset}
                style={{
                    padding: "10px 20px",
                    backgroundColor: theme.buttonBackgroundColor,
                    color: theme.buttonTextColor,
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "20px"
                }}
            >
                Try Again
            </button>
        </div>
    );
};

export default ErrorPage;
