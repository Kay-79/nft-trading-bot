import {
    API_AI_PRICE_PREDICT,
    API_MOBOX,
    CACHE_MBOX_PRICE,
    CACHE_REWARD_PER_1000_HASH,
    PRO_BUYER
} from "../constants/constants";
import axios from "axios";
import { newbieBidders, proBidders } from "@/config/config";
import { PredictMode } from "@/enum/enum";
import { ethers } from "ethers";
import { TrainingData } from "@/types/AI/TrainingData";
import { RecentSold } from "@/types/dtos/RecentSold.dto";
import { getPriceMboxOnChain } from "@/utilsV2/pancakeSwap/router";
import { stakingUtils } from "@/utilsV2/staking/utils";
import fs from "fs";
import { AuctionDto } from "@/types/dtos/Auction.dto";

export const getTrainingData = async (): Promise<TrainingData[]> => {
    const trainingData: TrainingData[] = [];
    const res1 = await axios.get(`${API_MOBOX}/auction/transactions/top50`);
    const rawDatasets: RecentSold[] = [...res1.data.list];
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

export const preprocessRawData = (rawDatasets: RecentSold[]): TrainingData[] => {
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
    console.log("Predicting model...", API_AI_PRICE_PREDICT);
    if (predictMode === PredictMode.ONE) {
        try {
            const response = await axios.post(API_AI_PRICE_PREDICT, {
                input: inputOne
            });
            console.log("===================================================================");
            console.log("Input:\t\t\t", inputOne);
            console.log("Prediction:\t\t", response.data.prediction[0]);
            console.log("===================================================================");
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
            checkTrader(dataset.bidder, newbieBidders, "Bidder (newbie):");
        }
        if (dataset.auctor) {
            checkTrader(dataset.auctor, proBidders, "Auctor (Pro):");
            checkTrader(dataset.auctor, newbieBidders, "Auctor (newbie):");
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

export const getMboxPriceAndRewardDelay5m = async (): Promise<{
    mboxPrice: number;
    reward: number;
}> => {
    let cache;
    if (fs.existsSync("./src/AI/predict/cache.json")) {
        cache = fs.readFileSync("./src/AI/predict/cache.json", "utf-8");
    } else {
        console.log("Create new cache file");
        cache = JSON.stringify({ mboxPrice: 0, reward: 0, latestCheck: 0 });
    }
    const cacheJson = JSON.parse(cache);
    const timestamp = cacheJson.latestCheck;
    if (Date.now() / 1000 - timestamp > 5 * 60) {
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
