import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/",
                has: [{ type: "header", key: "x-http-method-override", value: "HEAD" }]
            }
        ];
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin" // or "same-origin-allow-popups"
                    },
                    {
                        key: "Cross-Origin-Embedder-Policy",
                        value: "require-corp"
                    }
                ]
            }
        ];
    },
    env: {
        ENV: process.env.ENV || "development", // Ensure a default value is provided
        NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS || "false",
        NORMAL_BUYER_TESTNET: process.env.NORMAL_BUYER_TESTNET || "",
        PRO_BUYER_TESTNET: process.env.PRO_BUYER_TESTNET || "",
        CHANGER_TESTNET: process.env.CHANGER_TESTNET || "",
        NORMAL_BUYER_MAINNET: process.env.NORMAL_BUYER_MAINNET || "",
        PRO_BUYER_MAINNET: process.env.PRO_BUYER_MAINNET || "",
        CHANGER_MAINNET: process.env.CHANGER_MAINNET || "",
        MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
        MORALIST_RPC_ARCHIVE_NODE: process.env.MORALIST_RPC_ARCHIVE_NODE || ""
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.mobox.io"
            }
        ]
    }
};

export default nextConfig;
