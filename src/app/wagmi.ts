import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";

type RainbowKitConfig = ReturnType<typeof getDefaultConfig>;

let wagmiConfig: RainbowKitConfig | null;
if (typeof window !== "undefined") {
    wagmiConfig = getDefaultConfig({
        appName: "RainbowKit demo",
        projectId: "21fef48091f12692cad574a6f7753643",
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
