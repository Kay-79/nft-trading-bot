import fs from "fs";
import { traders } from "config/config";
import { ethers } from "ethers";

export const cleanDatasets = async () => {
    const filePath = "./src/AI/data/moboxDatasets.json";
    let existingData = [];
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = fileContent.trim() ? JSON.parse(fileContent) : [];
    }
    let newData = existingData.filter(
        (dataset: {
            input: number[];
            output: number[];
            bidTime: number;
            listTime: number;
            bidder: string;
            auctor: string;
        }) =>
            dataset.input.length === 4 &&
            dataset.output.length === 1 &&
            !traders.includes(dataset.bidder.toLowerCase()) &&
            !traders.includes(ethers.getAddress(dataset.bidder)) &&
            dataset.output[0] > 7 &&
            dataset.output[0] < 1500 &&
            dataset.bidTime - dataset.listTime > 5 * 60
    );
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
};

cleanDatasets();
