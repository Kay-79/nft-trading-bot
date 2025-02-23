import { readContract, writeContract } from "@wagmi/core";
import { abiERC20 } from "@/abi/abiERC20";
import { wagmiConfig } from "@/app/wagmi";

export const transfer = async (from: string, to: string, amount: number) => {
    if (!wagmiConfig) {
        throw new Error("wagmiConfig is null");
    }
    // check if the user has enough balance
    const balance = await readContract(wagmiConfig, {
        abi: abiERC20,
        address: "0x190B955CE93deDACA9E3Dcc06BF19BF025B194C6",
        functionName: "balanceOf",
        args: [from]
    });
    if (balance ?? 0 < amount) {
        throw new Error("Insufficient balance");
    }
    return await writeContract(wagmiConfig, {
        abi: abiERC20,
        address: "0x190B955CE93deDACA9E3Dcc06BF19BF025B194C6",
        functionName: "transfer",
        args: [to, amount]
    });
};
