import { readContract, writeContract } from "@wagmi/core";
import { abiERC20 } from "@/abi/abiERC20";
import { wagmiConfig } from "@/app/wagmi";
import { abiMp } from "@/abi/abiMp";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { ethers } from "ethers";
import { MP_ADDRESS } from "@/constants/constants";

const transfer = async (from: string, to: string, amount: number) => {
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
    const decimals = (await readContract(wagmiConfig, {
        abi: abiERC20,
        address: "0x190B955CE93deDACA9E3Dcc06BF19BF025B194C6",
        functionName: "decimals"
    })) as number;
    const amountInWei = ethers.parseUnits(amount.toString(), decimals.toString());
    if (balance ?? 0 < amountInWei) {
        throw new Error("Insufficient balance");
    }
    return await writeContract(wagmiConfig, {
        abi: abiERC20,
        address: "0x190B955CE93deDACA9E3Dcc06BF19BF025B194C6",
        functionName: "transfer",
        args: [to, amountInWei]
    });
};

const changePrice = async (
    listing: AuctionDto,
    from: `0x${string}` | undefined, // useAccount()
    newPrice: number
) => {
    if (!wagmiConfig) {
        throw new Error("Please connect your wallet first!");
    }
    if (from?.toLocaleLowerCase() !== (listing.auctor || "").toLocaleLowerCase()) {
        throw new Error("You are not the owner of the listing!");
    }
    const price = ethers.parseUnits(newPrice.toString(), 18);
    return await writeContract(wagmiConfig, {
        abi: abiMp,
        address: MP_ADDRESS as `0x${string}`,
        functionName: "changePrice",
        args: [listing.index, price, price, 2]
    });
};

export const mpContractService = {
    transfer,
    changePrice
};
