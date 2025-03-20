import { readContract, writeContract } from "@wagmi/core";
import { abiERC20 } from "@/abi/abiERC20";
import { wagmiConfig } from "@/app/wagmi";
import { abiMp } from "@/abi/abiMp";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { ethers } from "ethers";
import { CHANGER, MP_ADDRESS, PRO_BUYER } from "@/constants/constants";

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
        throw new Error("You are not the owner or changer of the listing!");
    }
    const price = ethers.parseUnits(newPrice.toString(), 18);
    const to = listing.auctor?.toLocaleLowerCase() === PRO_BUYER ? MP_ADDRESS : listing.auctor;
    return await writeContract(wagmiConfig, {
        abi: abiMp,
        address: to as `0x${string}`,
        functionName: "changePrice",
        args: [listing.index, price, price, 2]
    });
};

const cancelAuction = async (listing: AuctionDto, from: `0x${string}` | undefined) => {
    if (!wagmiConfig) {
        throw new Error("Please connect your wallet first!");
    }
    if (from?.toLocaleLowerCase() !== CHANGER.toLocaleLowerCase()) {
        throw new Error("You are not the changer of the listing! ");
    }
    return await writeContract(wagmiConfig, {
        abi: abiMp,
        address: listing.auctor as `0x${string}`,
        functionName: "cancelAuction",
        args: [listing.index]
    });
};

export const mpContractService = {
    transfer,
    changePrice,
    cancelAuction
};
