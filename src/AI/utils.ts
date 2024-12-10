import axios from "axios";
import { API_MOBOX } from "../constants/constants";
import { NeuralNetwork } from "brain.js";
import fs from "fs";

export const initModel = async () => {
    const net = new NeuralNetwork();
    const trainingData = [
        { input: [0, 0], output: [0] },
        { input: [0, 1], output: [1] },
        { input: [1, 0], output: [1] },
        { input: [1, 1], output: [0] }
    ];
    const model = net.toJSON();
    fs.writeFileSync("./src/AI/model/model.json", JSON.stringify(model));
    return model;
};

export const getDataset = async () => {
    const url = API_MOBOX
    console.log("Full URL:", url);
    const rawdata = await axios.get(`${API_MOBOX}/auction/transactions/top50`);
    const dataset = rawdata.data;
    console.log(dataset);
};
