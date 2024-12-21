import { API_AI_PRICE, API_MOBOX } from "../constants/constants";
import axios from "axios";
import { TrainingData } from "types/AI/TrainingData";
import { RecentSold } from "types/dtos/RecentSold.dto";

export const getTrainingData = async (): Promise<TrainingData[]> => {
    let trainingData: any[] = [];
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
    let cachesChecked: string[] = [];
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

export const predictModel = async (inputOne: number[]) => {
    console.log("Predicting model...", API_AI_PRICE);
    if (inputOne.length === 4) {
        try {
            const params = new URLSearchParams();
            (inputOne ?? []).forEach(value => params.append("input", value.toString()));
            const response = await axios.get(API_AI_PRICE, {
                params: params
            });
            console.log(response.data.prediction[0]);
            return;
        } catch (error) {
            console.error("Error predicting model:", error);
            throw error;
        }
    }
    const datasetsTest = await getTrainingData();
    for (let i = 0; i < datasetsTest.length; i++) {
        const dataset = datasetsTest[i];
        const input = dataset.input;
        try {
            const params = new URLSearchParams();
            (input ?? []).forEach(value => params.append("input", value.toString()));
            const response = await axios.get(API_AI_PRICE, {
                params: params
            });
            if (dataset.output) {
                console.log(input);
                console.log(response.data.prediction[0], dataset.output[0]);
            } else {
                console.warn("Dataset output is undefined");
            }
        } catch (error) {
            console.error("Error predicting model:", error);
            throw error;
        }
    }
};
