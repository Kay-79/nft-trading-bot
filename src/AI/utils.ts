import {
    API_AI_PRICE_PREDICT,
    API_MOBOX,
    CACHE_MBOX_PRICE,
    CACHE_REWARD_PER_1000_HASH,
    PRO_BUYER
} from "../constants/constants";
import axios from "axios";
import { newbieAuctors, newbieBidders, proBidders } from "@/config/config";
import { PredictMode } from "@/enum/enum";
import { ethers } from "ethers";
import { TrainingData } from "@/types/AI/TrainingData";
import { RecentSoldDto } from "@/types/dtos/RecentSold.dto";
import { getPriceMboxOnChain } from "@/utilsV2/pancakeSwap/router";
import { stakingUtils } from "@/utilsV2/staking/utils";
import fs from "fs";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { CachePriceReward } from "@/types/AI/CachePriceReward";
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

export const predictModel = async (inputOne: number[], predictMode: string) => {
    if (predictMode === PredictMode.ONE) {
        try {
            const response = await axios.post(API_AI_PRICE_PREDICT, {
                input: inputOne
            });
            return response.data.prediction[0];
        } catch (error) {
            console.error("Error predicting model:", error);
            throw error;
        }
    }
    const datasetsTest = await getTrainingData();
    for (let i = 0; i < datasetsTest.length; i++) {
        const dataset = datasetsTest[i];
        let totalPredicted = 0;
        console.log("===================================================================");
        const checkTrader = (address: string, traders: string[], type: string) => {
            if (
                traders.includes(ethers.getAddress(address)) ||
                traders.includes(address.toLowerCase())
            ) {
                console.log(`${type}\t\t`, address);
            }
        };
        if (dataset.bidder) {
            checkTrader(dataset.bidder, proBidders, "Bidder (Pro):");
            checkTrader(dataset.bidder, newbieBidders, "Bidder (New):");
        }
        if (dataset.auctor) {
            checkTrader(dataset.auctor, proBidders, "Auctor (Pro):");
            checkTrader(dataset.auctor, newbieBidders, "Auctor (New):");
        }
        for (const input of dataset.inputs ?? []) {
            input.push(...inputOne.slice(-3));
            try {
                const response = await axios.post(API_AI_PRICE_PREDICT, {
                    input: input
                });
                console.log("Input:\t\t\t", input);
                console.log("Prediction:\t\t", response.data.prediction[0]);
                totalPredicted += Number(response.data.prediction[0]);
            } catch (error) {
                console.error("Error predicting model:", error);
                throw error;
            }
        }
        if (dataset.output) {
            console.log("Total price:\t\t", dataset.output[0]);
        }
        console.log("Total predicted:\t", totalPredicted);
        console.log("===================================================================");
    }
    return 0;
};

export const predictModelOne = async (inputOne: number[]) => {
    return predictModel(inputOne, PredictMode.ONE);
};

export const getMboxPriceAndRewardDelay1Hour = async (): Promise<{
    mboxPrice: number;
    reward: number;
}> => {
    let cache;
    if (fs.existsSync("./src/AI/predict/cache.json")) {
        cache = fs.readFileSync("./src/AI/predict/cache.json", "utf-8");
    } else {
        console.log("Create new cache file");
        const newCache: CachePriceReward = { mboxPrice: 0, reward: 0, timestamp: 0 };
        cache = JSON.stringify(newCache);
    }
    const cacheJson = JSON.parse(cache);
    const timestamp = cacheJson.timestamp;
    if (Date.now() / 1000 - timestamp > 60 * 60) {
        const mboxPrice = await getPriceMboxOnChain(-1, CACHE_MBOX_PRICE);
        const reward = await stakingUtils.getRewardPer1000Hashrate(-1, CACHE_REWARD_PER_1000_HASH);
        fs.writeFileSync(
            "./src/AI/predict/cache.json",
            JSON.stringify({ mboxPrice, reward, timestamp: Date.now() / 1000 })
        );
        return { mboxPrice, reward };
    }
    return { mboxPrice: cacheJson.mboxPrice, reward: cacheJson.reward };
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

export const predictListingsPro = async (mboxPrice: number, rewardPer1000Hashrate: number) => {
    let totalPriceAll = 0;
    let totalPredictedAll = 0;
    const data = await axios.get(
        `${API_MOBOX}/auction/list/BNB/${PRO_BUYER}?sort=-time&page=1&limit=128`
    );
    const listingsPro = data?.data?.list || [];
    const trainingData = preprocessListingsData(listingsPro);
    for (const data of trainingData) {
        let totalPredicted = 0;
        console.log("===================================================================");
        console.log(`PRO AUCTOR:\t\t ${data.auctor}`);
        if (data.inputs && data.inputs.length > 0) {
            for (const input of data.inputs ?? []) {
                console.log("Input:\t\t\t", input);
                input.push(Math.floor(Date.now() / 1000), mboxPrice, rewardPer1000Hashrate);
                try {
                    const response = await axios.post(API_AI_PRICE_PREDICT, {
                        input: input
                    });
                    console.log("Prediction:\t\t", response.data.prediction[0]);
                    totalPredicted += Number(response.data.prediction[0]);
                    totalPredictedAll += Number(response.data.prediction[0]);
                } catch (error) {
                    console.error("Error predicting model:", error);
                    throw error;
                }
            }
        } else {
            const input = data.input;
            console.log("Input:\t\t\t", input);
            if (input) {
                input.push(Math.floor(Date.now() / 1000), mboxPrice, rewardPer1000Hashrate);
                try {
                    const response = await axios.post(API_AI_PRICE_PREDICT, {
                        input: input
                    });
                    console.log("Prediction:\t\t", response.data.prediction[0]);
                    totalPredicted += Number(response.data.prediction[0]);
                    totalPredictedAll += Number(response.data.prediction[0]);
                } catch (error) {
                    console.error("Error predicting model:", error);
                    throw error;
                }
            }
        }
        if (data.price) {
            totalPriceAll += data.price;
            console.log("Price listing:\t\t", data.price);
        }
        console.log("Total predicted:\t", totalPredicted);
        console.log("===================================================================");
    }
    console.log("Total price all:\t", totalPriceAll);
    console.log("Total predicted all:\t", totalPredictedAll);
};

export const predictAuctionPro = async (auction: AuctionDto): Promise<number> => {
    try {
        if (
            !auction.tokenId ||
            !auction.nowPrice ||
            !auction.hashrate ||
            !auction.lvHashrate ||
            !auction.prototype ||
            !auction.level
        )
            return 0;
        const cache = await getMboxPriceAndRewardDelay1Hour();
        const momoInfo = [
            auction.hashrate,
            auction.lvHashrate,
            Math.floor(auction.prototype / 10 ** 4),
            auction.level
        ];
        const momoEquipment = await momo721.getEquipmentMomo(auction.tokenId.toFixed(0));
        const mboxPrice = cache.mboxPrice;
        const reward = cache.reward;
        const timestamp = Math.floor(Date.now() / 1000);
        const input = [...momoInfo, ...momoEquipment, mboxPrice, reward, timestamp];
        const prediction = await predictModel(input, PredictMode.ONE);
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
