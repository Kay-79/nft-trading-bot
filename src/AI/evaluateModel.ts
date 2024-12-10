import { NeuralNetwork } from "brain.js";
import fs from "fs";

export const evaluateModel = async () => {
    const model = await JSON.parse(fs.readFileSync("./src/AI/model/model.json", "utf8"));
    const net = new NeuralNetwork();
    net.fromJSON(model);
    let input = [230, 620, 4, 4]
    const output: number[] = net.run(input) as number[];
    console.log("Output: ", output[0] * (500 - 7) + 7);
};
