import { readContract } from "@wagmi/core";
import { abiERC20 } from "@/abi/abiERC20";
import { getWagmiConfig } from "@/app/wagmi";
import { USDT_ADDRESS } from "@/constants/constants";
import { ethers } from "ethers";
import { shortenNumber } from "@/utils/shorten";

const getBalance = async (address: string): Promise<number> => {
    if (!getWagmiConfig()) {
        throw new Error("getWagmiConfig() is null");
    }
    const balance = await readContract(getWagmiConfig(), {
        abi: abiERC20,
        address: USDT_ADDRESS,
        functionName: "balanceOf",
        args: [address]
    });
    return shortenNumber(Number(ethers.formatUnits(balance as ethers.BigNumberish, 18)), 0, 2);
};

export const erc20Contract = {
    getBalance
};
