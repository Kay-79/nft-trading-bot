import { NeuralNetwork } from "brain.js";

// Tạo mô hình mạng nơ-ron
const net = new NeuralNetwork();

// Dữ liệu huấn luyện
const trainingData = [
    { input: [0, 0], output: [0] },
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] }
];

// Huấn luyện mô hình
net.train(trainingData);

// Save model
const model = net.toJSON();
import fs from "fs";
fs.writeFileSync("./src/AI/model/model.json", JSON.stringify(model));

// Dự đoán với mô hình
const output = net.run([1, 0]); // Dự đoán đầu ra
console.log("Prediction:", output);

const netLoad = new NeuralNetwork();
const modelLoad = JSON.parse(fs.readFileSync("./src/AI/model/model.json", "utf8"));
netLoad.fromJSON(modelLoad);

const outputLoad = netLoad.run([1, 0]);
console.log("Prediction:", outputLoad);
