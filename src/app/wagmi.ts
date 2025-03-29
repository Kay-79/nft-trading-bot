import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc } from "wagmi/chains";

type RainbowKitConfig = ReturnType<typeof getDefaultConfig>;

let wagmiConfig: RainbowKitConfig | null;
if (typeof window !== "undefined") {
    wagmiConfig = getDefaultConfig({
        appName: "NFT Trading",
        projectId: "e97ae58b9c8f8f7811ba85f2f0f9f3f9",
        chains: [bsc],
        ssr: true
    }) as RainbowKitConfig;
} else {
    wagmiConfig = null;
}

export { wagmiConfig };
