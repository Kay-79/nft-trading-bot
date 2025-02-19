import { writeContract } from "@wagmi/core";
import { abiERC20 } from "@/abi/abiERC20";
import { wagmiConfig } from "@/app/wagmi";

export const transfer = async (from: string, to: string, amount: number) => {
    if (!wagmiConfig) {
        throw new Error("wagmiConfig is null");
    }
    return await writeContract(wagmiConfig, {
        abi: abiERC20,
        address: "0x190B955CE93deDACA9E3Dcc06BF19BF025B194C6",
        functionName: "transfer",
        args: [to, amount]
    });
};
