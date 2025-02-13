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
    }
};

export default nextConfig;
