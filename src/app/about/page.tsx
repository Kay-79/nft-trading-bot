"use client";

import React from "react";
import { useTheme } from "@/config/theme";
import ThemedButton from "@/components/Theme/ThemedButton";

/**
 * @description About page component for the application.
 * @returns {JSX.Element}
 */
const AboutPage = () => {
    // Access the current theme
    const { theme } = useTheme();

    return (
        // Main container with dynamic background and text color based on the theme
        <div
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                fontFamily: "Arial, sans-serif"
            }}
        >
            {/* Header section */}
            <header style={{ marginBottom: "40px", textAlign: "center" }}>
                {/* Main title with dynamic color */}
                <h1 style={{ color: theme.primaryColor, fontSize: "3rem" }}>About NFT Trading</h1>
                {/* Subtitle */}
                <p style={{ fontSize: "1.2rem" }}>
                    Learn more about the NFT Trading and its features.
                </p>
            </header>

            {/* Features section */}
            <section style={{ marginBottom: "40px" }}>
                {/* Section title with dynamic color */}
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Features</h2>
                {/* List of features */}
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li style={{ marginBottom: "10px" }}>🚀 Real-time Mempool Monitoring</li>
                    <li style={{ marginBottom: "10px" }}>📈 Arbitrage Strategy</li>
                    <li style={{ marginBottom: "10px" }}>🤖 Automated Trading</li>
                    <li style={{ marginBottom: "10px" }}>⛽ Gas Optimization</li>
                    <li style={{ marginBottom: "10px" }}>⚙️ Configurable Parameters</li>
                    <li style={{ marginBottom: "10px" }}>🔄 Upgradeable Contracts</li>
                </ul>
            </section>

            {/* Getting Started section */}
            <section style={{ marginBottom: "40px" }}>
                {/* Section title with dynamic color */}
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Getting Started</h2>
                {/* Steps to get started */}
                <p>Follow these steps to get started with the bot:</p>
                <ol style={{ paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "10px" }}>Clone the repository</li>
                    <li style={{ marginBottom: "10px" }}>Install dependencies</li>
                    <li style={{ marginBottom: "10px" }}>Configure environment variables</li>
                    <li style={{ marginBottom: "10px" }}>Configure the bot</li>
                </ol>
            </section>

            {/* Usage section */}
            <section style={{ marginBottom: "40px" }}>
                {/* Section title with dynamic color */}
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Usage</h2>
                {/* Instructions to start the bot */}
                <p>Start the bot and monitor its performance:</p>
                {/* Button to start the bot */}
                <ThemedButton onClick={() => alert("Bot started!")}>Start Bot</ThemedButton>
            </section>

            {/* Achievements section */}
            <section style={{ marginBottom: "40px" }}>
                {/* Section title with dynamic color */}
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Achievements</h2>
                {/* Achievements list */}
                <p>As of November 2024:</p>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li style={{ marginBottom: "10px" }}>
                        ✅ Sent over 100,000 transactions on the Binance Smart Chain
                    </li>
                    <li style={{ marginBottom: "10px" }}>🔥 Burned around $11,800 in gas fees</li>
                    <li style={{ marginBottom: "10px" }}>💰 Generated around $10,271 in profit</li>
                </ul>
            </section>

            {/* Contributing section */}
            <section style={{ marginBottom: "40px" }}>
                {/* Section title with dynamic color */}
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Contributing</h2>
                {/* Instructions to contribute */}
                <p>
                    If you have suggestions or would like to contribute to the project, feel free to
                    open an issue or submit a pull request.
                </p>
            </section>

            {/* License section */}
            <section>
                {/* Section title with dynamic color */}
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>License</h2>
                {/* License information */}
                <p>
                    This project is licensed under the MIT License. See the LICENSE file for
                    details.
                </p>
            </section>
        </div>
    );
};

export default AboutPage;
