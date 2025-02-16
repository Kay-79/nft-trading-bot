"use client";

import React from "react";
import { useTheme } from "@/config/theme";
import ThemedButton from "@/components/Theme/ThemedButton";

const LandingPage = () => {
    const { theme } = useTheme();

    return (
        <div
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                fontFamily: "Arial, sans-serif"
            }}
        >
            <header style={{ marginBottom: "40px", textAlign: "center" }}>
                <h1 style={{ color: theme.primaryColor, fontSize: "3rem" }}>Mobox Profit Bot</h1>
                <p style={{ fontSize: "1.2rem" }}>
                    A sophisticated bot designed to front-run transactions on the Binance Smart
                    Chain (BSC) and profit from arbitrage opportunities in the Mobox ecosystem.
                </p>
            </header>

            <section style={{ marginBottom: "40px" }}>
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Features</h2>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li style={{ marginBottom: "10px" }}>🚀 Real-time Mempool Monitoring</li>
                    <li style={{ marginBottom: "10px" }}>📈 Arbitrage Strategy</li>
                    <li style={{ marginBottom: "10px" }}>🤖 Automated Trading</li>
                    <li style={{ marginBottom: "10px" }}>⛽ Gas Optimization</li>
                    <li style={{ marginBottom: "10px" }}>⚙️ Configurable Parameters</li>
                    <li style={{ marginBottom: "10px" }}>🔄 Upgradeable Contracts</li>
                </ul>
            </section>

            <section style={{ marginBottom: "40px" }}>
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Getting Started</h2>
                <p>Follow these steps to get started with the bot:</p>
                <ol style={{ paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "10px" }}>Clone the repository</li>
                    <li style={{ marginBottom: "10px" }}>Install dependencies</li>
                    <li style={{ marginBottom: "10px" }}>Configure environment variables</li>
                    <li style={{ marginBottom: "10px" }}>Configure the bot</li>
                </ol>
            </section>

            <section style={{ marginBottom: "40px" }}>
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Usage</h2>
                <p>Start the bot and monitor its performance:</p>
                <ThemedButton onClick={() => alert("Bot started!")}>Start Bot</ThemedButton>
            </section>

            <section style={{ marginBottom: "40px" }}>
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Achievements</h2>
                <p>As of November 2024:</p>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li style={{ marginBottom: "10px" }}>
                        ✅ Sent over 100,000 transactions on the Binance Smart Chain
                    </li>
                    <li style={{ marginBottom: "10px" }}>🔥 Burned around $11,800 in gas fees</li>
                    <li style={{ marginBottom: "10px" }}>💰 Generated around $10,271 in profit</li>
                </ul>
            </section>

            <section style={{ marginBottom: "40px" }}>
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>Contributing</h2>
                <p>
                    If you have suggestions or would like to contribute to the project, feel free to
                    open an issue or submit a pull request.
                </p>
            </section>

            <section>
                <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>License</h2>
                <p>
                    This project is licensed under the MIT License. See the LICENSE file for
                    details.
                </p>
            </section>
        </div>
    );
};

export default LandingPage;
