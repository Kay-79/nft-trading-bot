import * as brain from "brain.js";
import { getTrainingData } from "./utils";
import fs from "fs";

export const initModel = async () => {
    const net = new brain.NeuralNetwork({
        hiddenLayers: [5, 5]
    });
    const trainingData = await getTrainingData();
    net.train(trainingData as any[], {
        log: true,
  logPeriod: 100,
  errorThresh: 0.00005,
  iterations: 100000
    });
    const model = net.toJSON();
    fs.writeFileSync("./src/AI/model/model.json", JSON.stringify(model));
    return model;
};
