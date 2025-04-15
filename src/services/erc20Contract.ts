import { readContract } from "@wagmi/core";
import { abiERC20 } from "@/abi/abiERC20";
import { wagmiConfig } from "@/app/wagmi";
import { USDT_ADDRESS } from "@/constants/constants";
import { ethers } from "ethers";
import { shortenNumber } from "@/utils/shorten";

const transfer = async (from: string, to: string, amount: number) => {
    console.log("Transfer function called with:", from, to, amount);
};

const getBalance = async (address: string): Promise<number> => {
    if (!wagmiConfig) {
        throw new Error("wagmiConfig is null");
    }
    // check if the user has enough balance
    const balance = await readContract(wagmiConfig, {
        abi: abiERC20,
        address: USDT_ADDRESS,
        functionName: "balanceOf",
        args: [address]
    });
    return shortenNumber(Number(ethers.formatUnits(balance as ethers.BigNumberish, 18)), 0, 3);
};

export const erc20Contract = {
    transfer,
    getBalance
};
