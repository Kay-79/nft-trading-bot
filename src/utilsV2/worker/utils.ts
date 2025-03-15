import { MomoType } from "@/enum/enum";
import { AnalysisDto } from "@/types/dtos/Analysis.dto";
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

export const logBidToInventory = (
    owner: string,
    data: string
): { inventories: InventoryDto[]; analysis: AnalysisDto } => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
        data
    );
    const tokenId = decodeData[2];
    const ids = decodeData[3];
    const amounts = decodeData[4];
    const inventories: InventoryDto[] = [];
    if (Number(tokenId)) {
        inventories.push({
            id: `${owner}_99999_${tokenId}`,
            prototype: 99999,
            owner,
            amount: 1,
            tokenId: Number(tokenId),
            type: MomoType.PRO,
            quality: 1,
            category: 1,
            level: 1,
            specialty: 1,
            hashrate: 1,
            lvHashrate: 1
        });
        const analysis: AnalysisDto = {
            id: MomoType.PRO,
            totalBid: Number(decodeData[0]) / 1e9,
            totalSell: 0,
            countBid: 1,
            countSell: 0,
            countChange: 0,
            countCancel: 0
        };
        return { inventories, analysis };
    } else {
        let countBid = 0;
        for (let i = 0; i < ids.length; i++) {
            inventories.push({
                id: `${owner}_${ids[i]}_${tokenId}`,
                prototype: Number(ids[i]),
                owner,
                amount: Number(amounts[i]),
                tokenId: Number(tokenId),
                type: MomoType.NORMAL,
                quality: 1,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 1,
                lvHashrate: 1
            });
            countBid += Number(amounts[i]);
        }
        const analysis: AnalysisDto = {
            id: MomoType.PRO,
            totalBid: Number(decodeData[0]) / 1e9,
            totalSell: 0,
            countBid: countBid,
            countSell: 0,
            countChange: 0,
            countCancel: 0
        };
        return { inventories, analysis };
    }
};

export const logCancelToInventory = (
    auctor: string,
    data: string
): { inventories: InventoryDto[]; analysis: AnalysisDto } => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
        data
    );
    const tokenId = decodeData[1];
    const ids = decodeData[2];
    const amounts = decodeData[3];
    const inventories: InventoryDto[] = [];
    if (Number(tokenId)) {
        inventories.push({
            id: `${auctor}_99999_${tokenId}`,
            prototype: 99999,
            owner: auctor,
            amount: 1,
            tokenId: Number(tokenId),
            type: MomoType.PRO,
            quality: 1,
            category: 1,
            level: 1,
            specialty: 1,
            hashrate: 1,
            lvHashrate: 1
        });
        const analysis: AnalysisDto = {
            id: MomoType.PRO,
            totalBid: 0,
            totalSell: 0,
            countBid: 0,
            countSell: 0,
            countChange: 0,
            countCancel: 1
        };
        return { inventories, analysis };
    } else {
        for (let i = 0; i < ids.length; i++) {
            inventories.push({
                id: `${auctor}_${ids[i]}_${tokenId}`,
                prototype: Number(ids[i]),
                owner: auctor,
                amount: Number(amounts[i]),
                tokenId: Number(tokenId),
                type: MomoType.NORMAL,
                quality: 1,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 1,
                lvHashrate: 1
            });
        }
        const analysis: AnalysisDto = {
            id: MomoType.NORMAL,
            totalBid: 0,
            totalSell: 0,
            countBid: 0,
            countSell: 0,
            countChange: 0,
            countCancel: 1
        };
        return { inventories, analysis };
    }
};

export const logCreateToListing = (
    auctor: string,
    data: string
): { auctions: AuctionDto[]; analysis: AnalysisDto } => {
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
        prototype: Number(ids[0]),
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
    if (!Number(tokenId)) {
        const analysis: AnalysisDto = {
            id: MomoType.PRO,
            totalBid: 0,
            totalSell: 0,
            countBid: 0,
            countSell: 1,
            countChange: 0,
            countCancel: 0
        };
        return { auctions: listings, analysis };
    } else {
        let countSell = 0;
        for (let i = 0; i < ids.length; i++) {
            countSell += Number(amounts[i]);
        }
        const analysis: AnalysisDto = {
            id: MomoType.NORMAL,
            totalBid: 0,
            totalSell: 0,
            countBid: 0,
            countSell: countSell,
            countChange: 0,
            countCancel: 0
        };
        return { auctions: listings, analysis };
    }
};

export const logChangeToChange = (
    auctor: string,
    data: string
): { change: ChangeDto; analysis: AnalysisDto } => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
        data
    );
    const change: ChangeDto = {
        id: `bnb_${auctor}_${decodeData[3]}`,
        startPrice: Number(decodeData[0]) / 1e9,
        endPrice: Number(decodeData[1]) / 1e9,
        durationDays: Number(decodeData[2]),
        index: Number(decodeData[3]),
        oldStartTime: Number(decodeData[4]),
        newStartTime: Number(decodeData[5])
    };
    const analysis: AnalysisDto = {
        id: MomoType.NORMAL,
        totalBid: 0,
        totalSell: 0,
        countBid: 0,
        countSell: 0,
        countChange: 1,
        countCancel: 0
    };
    return {
        change,
        analysis
    };
};

export const logCancelToId = (auctor: string, data: string): string => {
    const decodeData = abiCoder.decode(
        ["uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
        data
    );
    return `bnb_${auctor}_${decodeData[1]}`;
};
