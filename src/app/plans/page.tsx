"use client";

import React from "react";
import { useTheme } from "@/config/theme";
import ThemedButton from "@/components/Theme/ThemedButton";

/**
 * @description Pricing Plans page component for the application.
 * @returns {JSX.Element}
 */
const PlansPage = () => {
    // Access the current theme
    const { theme } = useTheme();

    const plans = [
        {
            name: "Basic",
            price: "$10/month",
            features: ["Feature 1", "Feature 2", "Feature 3"]
        },
        {
            name: "Pro",
            price: "$20/month",
            features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
        },
        {
            name: "Enterprise",
            price: "$50/month",
            features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]
        }
    ];

    return (
        // Main container with dynamic background and text color based on the theme
        <div
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh"
            }}
        >
            {/* Header section */}
            <header style={{ marginBottom: "40px", textAlign: "center" }}>
                {/* Main title with dynamic color */}
                <h1 style={{ color: theme.primaryColor, fontSize: "3rem" }}>Pricing Plans</h1>
                {/* Subtitle */}
                <p style={{ fontSize: "1.2rem" }}>Choose the plan that best suits your needs.</p>
            </header>

            {/* Plans section */}
            <section style={{ display: "flex", justifyContent: "center", gap: "20px", flex: 1 }}>
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        style={{
                            border: `1px solid ${theme.primaryColor}`,
                            borderRadius: "10px",
                            padding: "20px",
                            width: "300px",
                            textAlign: "center"
                        }}
                    >
                        <h2 style={{ color: theme.secondaryColor, fontSize: "2rem" }}>
                            {plan.name}
                        </h2>
                        <p style={{ fontSize: "1.5rem", margin: "20px 0" }}>{plan.price}</p>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {plan.features.map((feature, i) => (
                                <li key={i} style={{ marginBottom: "10px" }}>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <ThemedButton onClick={() => alert(`Subscribed to ${plan.name} plan!`)}>
                            Subscribe
                        </ThemedButton>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default PlansPage;
