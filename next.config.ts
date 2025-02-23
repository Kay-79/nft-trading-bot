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
        ENV: process.env.ENV,
        MP_ADDRESS: process.env.MP_ADDRESS,
        NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS,
        NORMAL_BUYER_TESTNET: process.env.NORMAL_BUYER_TESTNET,
        PRO_BUYER_TESTNET: process.env.PRO_BUYER_TESTNET,
        CHANGER_TESTNET: process.env.CHANGER_TESTNET,
        PRIVATE_KEY_BID_TESTNET: process.env.PRIVATE_KEY_BID_TESTNET,
        PRIVATE_KEY_BID_PRO_TESTNET: process.env.PRIVATE_KEY_BID_PRO_TESTNET,
        PRIVATE_KEY_CHANGE_TESTNET: process.env.PRIVATE_KEY_CHANGE_TESTNET,
        NORMAL_BUYER_MAINNET: process.env.NORMAL_BUYER_MAINNET,
        PRO_BUYER_MAINNET: process.env.PRO_BUYER_MAINNET,
        CHANGER_MAINNET: process.env.CHANGER_MAINNET,
        PRIVATE_KEY_BID_MAINNET: process.env.PRIVATE_KEY_BID_MAINNET,
        PRIVATE_KEY_BID_PRO_MAINNET: process.env.PRIVATE_KEY_BID_PRO_MAINNET,
        PRIVATE_KEY_CHANGE_MAINNET: process.env.PRIVATE_KEY_CHANGE_MAINNET,
        MORALIST_RPC_ARCHIVE_NODE: process.env.MORALIST_RPC_ARCHIVE_NODE,
        GET_BLOCK_RPC_FULL_NODE: process.env.GET_BLOCK_RPC_FULL_NODE
    }
};

export default nextConfig;
