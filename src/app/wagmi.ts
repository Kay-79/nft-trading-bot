import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc, bscTestnet } from "wagmi/chains";

type RainbowKitConfig = ReturnType<typeof getDefaultConfig>;

let wagmiConfig: RainbowKitConfig | null;
if (typeof window !== "undefined") {
    wagmiConfig = getDefaultConfig({
        appName: "NFT Trading",
        projectId: "e97ae58b9c8f8f7811ba85f2f0f9f3f9",
        chains: [bsc, ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [bscTestnet] : [])],
        ssr: true
    }) as RainbowKitConfig;
} else {
    wagmiConfig = null;
}

export { wagmiConfig };
