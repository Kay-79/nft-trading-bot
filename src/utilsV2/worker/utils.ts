import { InventoryType } from "@/enum/enum";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { ChangeDto } from "@/types/worker/Change.dto";
import { AbiCoder } from "ethers";

const abiCoder = new AbiCoder();

export const logBidToId = (auctor: string, data: string): string => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
        data
    );
    return `bnb_${auctor}_${decodeData[1]}`;
};

export const logBidToInventory = (owner: string, data: string): InventoryDto[] => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
        data
    );
    const tokenId = decodeData[2];
    const ids = decodeData[3];
    const amounts = decodeData[4];
    const inventories: InventoryDto[] = [];
    if (Number(tokenId)) {
    } else {
        for (let i = 0; i < ids.length; i++) {
            inventories.push({
                id: `${owner}_${ids[i]}_${tokenId}`,
                prototype: Number(ids[i]),
                owner,
                amount: Number(amounts[i]),
                tokenId: Number(tokenId),
                type: InventoryType.NORMAL,
                quality: 1,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 1,
                lvHashrate: 1
            });
        }
    }
    return inventories;
};

export const logCancelToInventory = (auctor: string, data: string): InventoryDto[] => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
        data
    );
    const tokenId = decodeData[1];
    const ids = decodeData[2];
    const amounts = decodeData[3];
    const inventories: InventoryDto[] = [];
    if (Number(tokenId)) {
    } else {
        for (let i = 0; i < ids.length; i++) {
            inventories.push({
                id: `${auctor}_${ids[i]}_${tokenId}`,
                prototype: Number(ids[i]),
                owner: auctor,
                amount: Number(amounts[i]),
                tokenId: Number(tokenId),
                type: InventoryType.NORMAL,
                quality: 1,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 1,
                lvHashrate: 1
            });
        }
    }
    return inventories;
};

export const logCreateToListing = (auctor: string, data: string): AuctionDto[] => {
    const decodeData = abiCoder.decode(
        [
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256[]",
            "uint256[]",
            "uint256"
        ],
        data
    );
    const startPrice = Number(decodeData[0]) / 1e9;
    const endPrice = Number(decodeData[1]) / 1e9;
    const duration = decodeData[2];
    const index = decodeData[3];
    const tokenId = decodeData[4];
    const ids = decodeData[5];
    const amounts = decodeData[6];
    const startTime = decodeData[7];
    const listings: AuctionDto[] = [];
    for (let i = 0; i < ids.length; i++) {
        listings.push({
            id: `bnb_${auctor}_${index}`,
            auctor,
            startPrice: Number(startPrice),
            endPrice: Number(endPrice),
            durationDays: Number(duration),
            index: Number(index),
            ids: ids.map(String),
            amounts: amounts.map(String),
            tokenId: Number(tokenId),
            uptime: Number(startTime),
            prototype: Number(ids[i]),
            hashrate: 1,
            lvHashrate: 1,
            level: 1,
            specialty: 1,
            category: 1,
            quality: 1,
            tx: "",
            deleted: null,
            nowPrice: Number(startPrice)
        });
    }
    return listings;
};

export const logChangeToChange = (auctor: string, data: string): ChangeDto => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
        data
    );
    return {
        id: `bnb_${auctor}_${decodeData[3]}`,
        startPrice: Number(decodeData[0]) / 1e9,
        endPrice: Number(decodeData[1]) / 1e9,
        durationDays: Number(decodeData[2]),
        index: Number(decodeData[3]),
        oldStartTime: Number(decodeData[4]),
        newStartTime: Number(decodeData[5])
    };
};

export const logCancelToId = (auctor: string, data: string): string => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
        data
    );
    return `bnb_${auctor}_${decodeData[1]}`;
};
