import { API_MOBOX } from "../constants/constants";
import axios from "axios";
import { NeuralNetwork } from "brain.js";
import fs from "fs";
import { TrainingData } from "types/AI/TrainingData";
import { RecentSold } from "types/dtos/TopAuction.dto";

export const getTrainingData = async (): Promise<TrainingData[]> => {
    let trainingData: any[] = [];
    const res1 = await axios.get(`${API_MOBOX}/auction/transactions/top50`);
    const rawDatasets: RecentSold[] = res1.data.list;
    const res2 = await axios.get(`${API_MOBOX}/auction/logs_new`, {
        params: {
            limit: 100,
            page: 1
        }
    });
    rawDatasets.push(...res2.data.list);
    const finalDatasets = [];
    let cachesTx: string[] = [];
    for (const dataset of rawDatasets) {
        if (!dataset.tx) continue;
        if (cachesTx.includes(dataset.tx)) continue;
        cachesTx.push(dataset.tx);
        finalDatasets.push(dataset);
    }
    trainingData.push(...preprocessRawData(finalDatasets));
    return trainingData;
};

export const preprocessRawData = (rawDatasets: RecentSold[]): TrainingData[] => {
    if (!rawDatasets || rawDatasets.length === 0) return [];
    return rawDatasets.reduce<TrainingData[]>((acc, dataset) => {
        if (!dataset.tokens || !dataset.bidPrice || dataset.tokens.length != 1) return acc;
        const input = dataset.tokens.flatMap(token => {
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
        acc.push({ input, output });
        return acc;
    }, []);
};

export const predictModel = async (input: number[]): Promise<number> => {
    try {
        const params = new URLSearchParams();
        input.forEach(value => params.append("input", value.toString()));

        const response = await axios.get(`http://127.0.0.1:5000/predict`, {
            params: params
        });
        console.log(response.data.prediction[0]);
        return response.data.prediction[0];
    } catch (error) {
        console.error("Error predicting model:", error);
        throw error;
    }
};
