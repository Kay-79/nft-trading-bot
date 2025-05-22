import { RPC_URL } from "@/constants/constants";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc } from "wagmi/chains";
import { createPublicClient, http } from 'viem';

type RainbowKitConfig = ReturnType<typeof getDefaultConfig>;

let wagmiConfig: RainbowKitConfig | null;
if (typeof window !== "undefined") {
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
    wagmiConfig = getDefaultConfig({
        appName: "NFT Trading",
        projectId: "e97ae58b9c8f8f7811ba85f2f0f9f3f9",
        chains: [bscConfig]
    }) as RainbowKitConfig;
} else {
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
    wagmiConfig = getDefaultConfig({
        appName: "NFT Trading",
        projectId: "e97ae58b9c8f8f7811ba85f2f0f9f3f9",
        chains: [bscConfig]
    }) as RainbowKitConfig;
}

export const publicClient = createPublicClient({
  chain: bsc,
  transport: http(RPC_URL),
});

export { wagmiConfig };
