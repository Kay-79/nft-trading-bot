import { API_AI_PRICE_PREDICT, API_MOBOX } from "../constants/constants";
import axios from "axios";
import { newbieAuctors, newbieBidders, proBidders } from "@/config/config";
import { ethers } from "ethers";
import { TrainingData } from "@/types/AI/TrainingData";
import { RecentSoldDto } from "@/types/dtos/RecentSold.dto";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { momo721 } from "@/utilsV2/momo721/utils";

export const getTrainingData = async (): Promise<TrainingData[]> => {
    const trainingData: TrainingData[] = [];
    const res1 = await axios.get(`${API_MOBOX}/auction/transactions/top50`);
    const rawDatasets: RecentSoldDto[] = [...res1.data.list];
    const res2 = await axios.get(`${API_MOBOX}/auction/logs_new`, {
        params: {
            limit: 100,
            page: 1
        }
    });
    rawDatasets.push(...res2.data.list);
    const finalDatasets = [];
    const cachesChecked: string[] = [];
    for (const dataset of rawDatasets) {
        if (!dataset.tx || !dataset.tokens || !dataset.tokens[0]) continue;
        if (
            dataset.tokens[0].tokenId &&
            cachesChecked.includes(dataset.tx + dataset.tokens[0].tokenId)
        )
            continue;
        cachesChecked.push(dataset.tx + dataset.tokens[0].tokenId);
        finalDatasets.push(dataset);
    }
    trainingData.push(...preprocessRawData(finalDatasets));
    return trainingData;
};

export const preprocessRawData = (rawDatasets: RecentSoldDto[]): TrainingData[] => {
    if (!rawDatasets || rawDatasets.length === 0) return [];
    return rawDatasets.reduce<TrainingData[]>((acc, dataset) => {
        if (!dataset.tokens || !dataset.bidPrice) return acc;
        const input = [
            dataset.tokens[0].hashrate ?? 0,
            dataset.tokens[0].lvHashrate ?? 0,
            Math.floor((dataset.tokens[0].prototype ?? 0) / 10 ** 4),
            dataset.tokens[0].level ?? 0
        ];
        const inputs = dataset.tokens.map(token => {
            if (!token || !token.prototype || !token.hashrate || !token.lvHashrate || !token.level)
                return [0, 0, 0, 0];
            return [
                token.hashrate,
                token.lvHashrate,
                Math.floor(token.prototype / 10 ** 4),
                token.level
            ];
        });
        const output = [Number((dataset.bidPrice / 10 ** 9).toFixed(2))];
        const bidTime = dataset.crtime;
        const listTime = dataset.crtime;
        const bidder = dataset.bidder;
        const auctor = dataset.auctor;
        acc.push({ input, output, inputs, bidTime, listTime, bidder, auctor });
        return acc;
    }, []);
};

export const predictModelOne = async (inputOne: number[]) => {
    if (!inputOne || inputOne.length === 0) return [];
    try {
        const response = await axios.post(API_AI_PRICE_PREDICT, {
            input: inputOne
        });
        return response.data.prediction[0];
    } catch (error) {
        console.error("Error predicting model:", error);
        throw error;
    }
};

export const preprocessListingsData = (listingsPro: AuctionDto[]): TrainingData[] => {
    if (!listingsPro || listingsPro.length === 0) return [];
    return listingsPro.reduce<TrainingData[]>((acc, listing) => {
        if (!listing.tokenId || !listing.nowPrice) return acc;
        const input = [
            listing.hashrate ?? 0,
            listing.lvHashrate ?? 0,
            Math.floor((listing.prototype ?? 0) / 10 ** 4),
            listing.level ?? 0
        ];
        const inputs =
            listing.ids?.map((id, index) => {
                if (!id || !listing.amounts || !listing.amounts[index]) return [0, 0, 0, 0];
                return [
                    listing.hashrate ?? 0,
                    listing.lvHashrate ?? 0,
                    Math.floor((listing.prototype ?? 0) / 10 ** 4),
                    listing.level ?? 0
                ];
            }) ?? [];
        const price = Number((listing.nowPrice / 10 ** 9).toFixed(2));
        const bidTime = listing.uptime;
        const listTime = listing.uptime;
        const bidder = listing.auctor;
        const auctor = listing.auctor;
        acc.push({ input, inputs, bidTime, listTime, bidder, auctor, price });
        return acc;
    }, []);
};

export const predictAuctionPro = async (auction: AuctionDto): Promise<number> => {
    try {
        const input = await buildInputVector({
            hashrate: auction.hashrate || 0,
            lvHashrate: auction.lvHashrate || 0,
            prototype: auction.prototype || 0,
            level: auction.level || 0,
            tokenId: auction.tokenId || 0
        });
        const prediction = await predictModelOne(input);
        return prediction[0];
    } catch {
        return 0;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cleanDatasets = (datasets: any[]) => {
    const proTradersNormalized = new Set(proBidders.map(addr => ethers.getAddress(addr)));
    const newbieTradersNormalized = new Set(newbieBidders.map(addr => ethers.getAddress(addr)));
    const newbieAuctorsNormalized = new Set(newbieAuctors.map(addr => ethers.getAddress(addr)));
    const newData = datasets.filter(
        (dataset: {
            bidder: string;
            auctor: string;
            output: number[];
            bidTime: number;
            listTime: number;
        }) => {
            const bidderAddress = ethers.getAddress(dataset.bidder.trim());
            const auctorAddress = ethers.getAddress(dataset.auctor.trim());
            const isNotnewbieAuctor = !newbieAuctorsNormalized.has(auctorAddress);
            const isNotProTrader = !proTradersNormalized.has(bidderAddress);
            const isNotnewbieTrader = !newbieTradersNormalized.has(bidderAddress);
            return (
                dataset.output.length === 1 &&
                isNotProTrader &&
                isNotnewbieTrader &&
                isNotnewbieAuctor &&
                dataset.bidTime - dataset.listTime > 5 * 60
            );
        }
    );
    return newData;
};

export async function buildInputVector({
    hashrate,
    lvHashrate,
    prototype,
    level,
    tokenId
}: {
    hashrate: number;
    lvHashrate: number;
    prototype: number;
    level: number;
    tokenId: string | number;
}): Promise<number[]> {
    const momoInfo = [hashrate, lvHashrate, Math.floor(prototype / 10 ** 4), level];
    const momoEquipment = await momo721.getEquipmentMomo(tokenId.toString());
    const timestamp = Math.floor(Date.now() / 1000);
    return [...momoInfo, ...momoEquipment, timestamp];
}
