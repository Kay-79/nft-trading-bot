import { MP_ADDRESS, MP_BLOCK_ADDRESS } from "@/constants/constants";
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
    data: string,
    address: string
): { inventories: InventoryDto[]; analysisPro: AnalysisDto; analysisNormal: AnalysisDto } => {
    let decodeData;
    let tokenIds: number[] = [];
    let ids;
    let amounts;
    let bidPrice = 0;
    if (address.toLowerCase() === MP_ADDRESS.toLowerCase()) {
        decodeData = abiCoder.decode(
            ["uint256", "uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
            data
        );
        tokenIds = [Number(decodeData[2])];
        ids = decodeData[3];
        amounts = decodeData[4];
        bidPrice = Number(decodeData[0]) / 1e18;
    }
    if (address.toLowerCase() === MP_BLOCK_ADDRESS.toLowerCase()) {
        decodeData = abiCoder.decode(
            ["uint256", "uint256", "uint256", "uint256", "uint256[]", "uint256[]"],
            data
        );
        tokenIds = decodeData[4];
        ids = decodeData[5];
        amounts = ids.map(() => 1);
        bidPrice = Number(decodeData[3]) / 1e18;
    }
    const inventories: InventoryDto[] = [];
    let analysisPro: AnalysisDto = {
        id: MomoType.PRO,
        totalBid: 0,
        totalSell: 0,
        countBid: 0,
        countSold: 0,
        countChange: 0,
        countCancel: 0
    };
    let analysisNormal: AnalysisDto = {
        id: MomoType.NORMAL,
        totalBid: 0,
        totalSell: 0,
        countBid: 0,
        countSold: 0,
        countChange: 0,
        countCancel: 0
    };
    if (tokenIds.length && Number(tokenIds[0])) {
        for (let i = 0; i < tokenIds.length; i++) {
            inventories.push({
                id: `${owner}_99999_${tokenIds[i]}`,
                prototype: 99999,
                owner,
                amount: 1,
                tokenId: Number(tokenIds[i]),
                type: MomoType.PRO,
                quality: 1,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: 999,
                lvHashrate: 9999
            });
        }
        analysisPro = {
            id: MomoType.PRO,
            totalBid: bidPrice,
            totalSell: 0,
            countBid: tokenIds.length,
            countSold: 0,
            countChange: 0,
            countCancel: 0
        };
    }
    if (ids.length) {
        let countBid = 0;
        for (let i = 0; i < ids.length; i++) {
            inventories.push({
                id: `${owner}_${ids[i]}_${0}`,
                prototype: Number(ids[i]),
                owner,
                amount: Number(amounts[i]),
                tokenId: Number(0),
                type: MomoType.NORMAL,
                quality: 1,
                category: 1,
                level: 1,
                specialty: 1,
                hashrate: Math.floor(ids[i] / 10000),
                lvHashrate: Math.floor(ids[i] / 10000)
            });
            countBid += Number(amounts[i]);
        }
        analysisNormal = {
            id: MomoType.NORMAL,
            totalBid: address.toLowerCase() === MP_ADDRESS.toLowerCase() ? bidPrice : 0,
            totalSell: 0,
            countBid: countBid,
            countSold: 0,
            countChange: 0,
            countCancel: 0
        };
    }
    return {
        inventories,
        analysisPro,
        analysisNormal
    };
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
            countSold: -1,
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
            countSold: -1,
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
    const prototype = ids.length ? Number(ids[0]) : 99999;
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
        prototype: prototype,
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
    if (Number(tokenId)) {
        const analysis: AnalysisDto = {
            id: MomoType.PRO,
            totalBid: 0,
            totalSell: 0,
            countBid: 0,
            countSold: 1,
            countChange: 0,
            countCancel: 0
        };
        return { auctions: listings, analysis };
    } else {
        let countSold = 0;
        for (let i = 0; i < ids.length; i++) {
            countSold += Number(amounts[i]);
        }
        const analysis: AnalysisDto = {
            id: MomoType.NORMAL,
            totalBid: 0,
            totalSell: 0,
            countBid: 0,
            countSold: countSold,
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
        countSold: 0,
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
