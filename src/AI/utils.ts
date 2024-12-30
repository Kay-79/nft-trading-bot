import { API_AI_PRICE, API_MOBOX } from "../constants/constants";
import axios from "axios";
import { traders } from "config/config";
import { TrainingData } from "types/AI/TrainingData";
import { RecentSold } from "types/dtos/RecentSold.dto";

export const getTrainingData = async (): Promise<TrainingData[]> => {
    let trainingData: TrainingData[] = [];
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
        const bidTime = dataset.crtime;
        const listTime = dataset.crtime;
        const bidder = dataset.bidder;
        const auctor = dataset.auctor;
        acc.push({ input, output, bidTime, listTime, bidder, auctor });
        return acc;
    }, []);
};

export const predictModel = async (inputOne: number[]): Promise<number> => {
    console.log("Predicting model...", API_AI_PRICE);
    if (inputOne.length === 4) {
        try {
            const params = new URLSearchParams();
            (inputOne ?? []).forEach(value => params.append("input", value.toString()));
            const response = await axios.get(API_AI_PRICE, {
                params: params
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
        const input = dataset.input;
        try {
            const params = new URLSearchParams();
            (input ?? []).forEach(value => params.append("input", value.toString()));
            const response = await axios.get(API_AI_PRICE, {
                params: params
            });
            if (dataset.output) {
                console.log("===================================================================");
                if (dataset.bidder && traders.includes(dataset.bidder))
                    console.log("Bidder is a trader:\t", dataset.bidder);
                if (dataset.auctor && traders.includes(dataset.auctor))
                    console.log("Auctor is a trader:\t", dataset.auctor);
                console.log("Input:\t\t\t", input);
                console.log("Output:\t\t\t", dataset.output);
                console.log("Prediction:\t\t", response.data.prediction[0]);
                console.log("===================================================================");
            } else {
                console.warn("Dataset output is undefined");
            }
        } catch (error) {
            console.error("Error predicting model:", error);
            throw error;
        }
    }
    return 0;
};
