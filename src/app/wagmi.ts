import { RPC_URL } from "@/constants/constants";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc } from "wagmi/chains";
import { createPublicClient, http } from "viem";

type RainbowKitConfig = ReturnType<typeof getDefaultConfig>;

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

const wagmiConfig: RainbowKitConfig = getDefaultConfig({
    appName: "NFT Trading",
    projectId: process.env.PROJECT_ID || "",
    chains: [bscConfig]
}) as RainbowKitConfig;

export const publicClient = createPublicClient({
    chain: bsc,
    transport: http(RPC_URL)
});

export { wagmiConfig };
