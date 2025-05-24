import { RPC_URL } from "@/constants/constants";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc } from "wagmi/chains";
import { createPublicClient, http } from "viem";

// type RainbowKitConfig = ReturnType<typeof getDefaultConfig>;

let wagmiConfigSingleton: ReturnType<typeof getDefaultConfig> | null = null;

const bscConfig = {
    ...bsc,
    rpcUrls: {
        ...bsc.rpcUrls,
        default: {
            ...bsc.rpcUrls.default,
            http: [RPC_URL]
        }
    }
};

export function getWagmiConfig() {
    if (!wagmiConfigSingleton) {
        wagmiConfigSingleton = getDefaultConfig({
            appName: "NFT Trading",
            projectId: process.env.PROJECT_ID || "",
            chains: [bscConfig],
            ssr: true
        });
    }

    return wagmiConfigSingleton;
}

export const publicClient = createPublicClient({
    chain: bsc,
    transport: http(RPC_URL)
});
