import { readContract, writeContract } from "@wagmi/core";
import { abiERC20 } from "@/abi/abiERC20";
import { wagmiConfig } from "@/app/wagmi";
import { abiMp } from "@/abi/abiMp";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { ethers } from "ethers";
import { ENV, MP_ADDRESS, PRO_BUYER } from "@/constants/constants";

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

const ajustPricePro = async (
    listing: AuctionDto,
    from: `0x${string}` | undefined,
    newPrice: number
) => {
    if (!wagmiConfig) {
        throw new Error("wagmiConfig is null");
    }
    console.log("Current env:", ENV);
    if (from?.toLocaleLowerCase() !== PRO_BUYER.toLocaleLowerCase()) {
        console.log(from);
        console.log(PRO_BUYER);
        console.log(MP_ADDRESS);
        throw new Error("You are not the owner of the listing");
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
    ajustPricePro
};
