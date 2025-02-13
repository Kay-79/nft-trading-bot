import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";

type RainbowKitConfig = ReturnType<typeof getDefaultConfig>;

let wagmiConfig: RainbowKitConfig | null;
if (typeof window !== "undefined") {
    wagmiConfig = getDefaultConfig({
        appName: "RainbowKit demo",
        projectId: "e97ae58b9c8f8f7811ba85f2f0f9f3f9",
        chains: [
            mainnet,
            polygon,
            optimism,
            arbitrum,
            base,
            ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : [])
        ],
        ssr: true
    }) as RainbowKitConfig;
} else {
    wagmiConfig = null;
}

export { wagmiConfig };
