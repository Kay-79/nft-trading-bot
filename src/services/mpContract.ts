import { readContract, writeContract } from "@wagmi/core";
import { abiERC20 } from "@/abi/abiERC20";
import { wagmiConfig } from "@/app/wagmi";
import { abiMp } from "@/abi/abiMp";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { ethers } from "ethers";
import { CHANGER, MP_ADDRESS, PRO_BUYER } from "@/constants/constants";
import { mpUtils } from "@/utilsV2/mp/utils";
import { MomoType } from "@/enum/enum";
import { BulkItemListStorage } from "@/store/reducers/bulkStorageReducer";
import { bidContract } from "@/config/config";
import { InventoryDto } from "@/types/dtos/Inventory.dto";

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
    from: `0x${string}` | undefined,
    newPrice: number
) => {
    if (!wagmiConfig) {
        throw new Error("Please connect your wallet first!");
    }
    if (from?.toLocaleLowerCase() !== CHANGER.toLocaleLowerCase()) {
        throw new Error("You are not the changer of the listing! ");
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

const createAuction = async (
    inventoryItem: InventoryDto,
    from: `0x${string}` | undefined,
    listPrice: number
) => {
    if (!wagmiConfig) {
        throw new Error("Please connect your wallet first!");
    }
    if (from?.toLocaleLowerCase() !== CHANGER.toLocaleLowerCase()) {
        throw new Error("You are not the changer of the listing! ");
    }
    const suggestIndex = await mpUtils.getNewIndex(inventoryItem.owner || "");
    const tokenIds: number[] = [];
    const prices721: bigint[] = [];
    const ids: number[] = [];
    const prices1155: bigint[] = [];
    if (inventoryItem.type === MomoType.PRO) {
        tokenIds.push(inventoryItem.tokenId || 0);
        const price = ethers.parseUnits(listPrice.toString(), 18);
        prices721.push(price);
    } else if (inventoryItem.type === MomoType.NORMAL) {
        ids.push(inventoryItem.prototype || 0);
        const price = ethers.parseUnits(listPrice.toString(), 18);
        prices1155.push(price);
    }
    if (tokenIds.length === 0 && ids.length === 0) {
        throw new Error("No items to sell");
    }
    return await writeContract(wagmiConfig, {
        abi: abiMp,
        address: inventoryItem.owner as `0x${string}`,
        functionName: "createAuctionBatch",
        args: [suggestIndex, tokenIds, prices721, ids, prices1155]
    });
};

const createAuctionBatch = async (
    bulkSellItems: BulkItemListStorage[],
    from: `0x${string}` | undefined
) => {
    if (!wagmiConfig) {
        throw new Error("Please connect your wallet first!");
    }
    if (from?.toLocaleLowerCase() !== CHANGER.toLocaleLowerCase()) {
        throw new Error("You are not the changer of the listing! ");
    }
    const owner = bulkSellItems[0].inventory.owner;
    const allSameOwner = bulkSellItems.every(item => item.inventory.owner === owner);
    if (!allSameOwner) {
        throw new Error("All items must have the same owner");
    }
    const suggestIndex = await mpUtils.getNewIndex(owner || "");
    const tokenIds: number[] = [];
    const prices721: bigint[] = [];
    const ids: number[] = [];
    const prices1155: bigint[] = [];
    for (const item of bulkSellItems) {
        for (let i = 0; i < item.quantity; i++) {
            if (item.inventory.type === MomoType.PRO) {
                tokenIds.push(item.inventory.tokenId || 0);
                const price = ethers.parseUnits(item.price.toString(), 18);
                prices721.push(price);
            } else if (item.inventory.type === MomoType.NORMAL) {
                ids.push(item.inventory.prototype || 0);
                const price = ethers.parseUnits(item.price.toString(), 18);
                prices1155.push(price);
            }
        }
    }
    if (
        tokenIds.length === 0 &&
        ids.length === 0 &&
        prices1155.length === 0 &&
        prices721.length === 0
    ) {
        throw new Error("No items to sell");
    }
    if (tokenIds.length > 6 && ids.length > 6 && prices1155.length > 6 && prices721.length > 6) {
        throw new Error("You can't sell more than 5 items at once");
    }
    return await writeContract(wagmiConfig, {
        abi: abiMp,
        address: owner as `0x${string}`,
        functionName: "createAuctionBatch",
        args: [suggestIndex, tokenIds, prices721, ids, prices1155]
    });
};

const bidAuction = async (listing: AuctionDto, from: `0x${string}` | undefined) => {
    if (!wagmiConfig) {
        throw new Error("Please connect your wallet first!");
    }
    if (from?.toLocaleLowerCase() !== PRO_BUYER.toLocaleLowerCase()) {
        throw new Error("Failed to bid the auction");
    }
    return await writeContract(wagmiConfig, {
        abi: abiMp,
        address: bidContract as `0x${string}`,
        functionName: "bid",
        args: [
            listing.auctor,
            listing.index,
            listing.uptime,
            ((listing?.nowPrice ?? 0) + 10 ** 5).toString() + "000000000"
        ]
    });
};

export const mpContractService = {
    transfer,
    changePrice,
    cancelAuction,
    createAuction,
    createAuctionBatch,
    bidAuction
};
