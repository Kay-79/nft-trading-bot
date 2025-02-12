import { API_AI_PRICE_PREDICT, API_MOBOX } from "../constants/constants";
import axios from "axios";
import { traders } from "@/config/config";
import { PredictMode } from "@/enum/enum";
import { ethers } from "ethers";
import { TrainingData } from "@/types/AI/TrainingData";
import { RecentSold } from "@/types/dtos/RecentSold.dto";

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
            const params = new URLSearchParams();
            (inputOne ?? []).forEach(value => params.append("input", value.toString()));
            const response = await axios.get(API_AI_PRICE_PREDICT, {
                params: params
            });
            console.log("===================================================================");
            console.log("Input:\t\t\t", inputOne);
            console.log("Prediction:\t\t", response.data.prediction[0]);
            console.log("===================================================================");
            return;
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
        if (
            dataset.bidder &&
            (traders.includes(ethers.getAddress(dataset.bidder)) ||
                traders.includes(dataset.bidder.toLowerCase()))
        )
            console.log("Bidder is a trader:\t", dataset.bidder);
        if (
            dataset.auctor &&
            (traders.includes(ethers.getAddress(dataset.auctor)) ||
                traders.includes(dataset.auctor.toLowerCase()))
        )
            console.log("Auctor is a trader:\t", dataset.auctor);
        for (const input of dataset.inputs ?? []) {
            const params = new URLSearchParams();
            //add last 3 elements of inputOne to input
            input.push(...inputOne.slice(-3));
            input.forEach(value => params.append("input", value.toString()));
            const response = await axios.get(API_AI_PRICE_PREDICT, { params });
            console.log("Input:\t\t\t", input);
            console.log("Prediction:\t\t", response.data.prediction[0]);
            totalPredicted += Number(response.data.prediction[0]);
        }
        if (dataset.output) {
            console.log("Total pirce:\t\t", dataset.output[0]);
        }
        console.log("Total predicted:\t", totalPredicted);
        console.log("===================================================================");
    }
    return 0;
};
