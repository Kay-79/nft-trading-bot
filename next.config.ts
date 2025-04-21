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
        NORMAL_BUYER_TESTNET:
            process.env.NORMAL_BUYER_TESTNET || "0x5555e5DC401AB6E86a240C7C3f3F86dE88E05Ee8",
        PRO_BUYER_TESTNET:
            process.env.PRO_BUYER_TESTNET || "0x99999841c9da62600956ff709aD03A39875f3766",
        CHANGER_TESTNET:
            process.env.CHANGER_TESTNET || "0x11119d51e2ff85d5353abf499fe63be3344c0000",
        NORMAL_BUYER_MAINNET:
            process.env.NORMAL_BUYER_MAINNET || "0x55555D4de8df0c455C2Ff368253388FE669a8888",
        PRO_BUYER_MAINNET:
            process.env.PRO_BUYER_MAINNET || "0x0e9bc747335a4b01a6194a6c1bb1de54a0a5355c",
        CHANGER_MAINNET:
            process.env.CHANGER_MAINNET || "0x11119d51e2ff85d5353abf499fe63be3344c0000",
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
