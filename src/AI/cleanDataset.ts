import fs from "fs";

export const cleanDataset = async () => {
    const filePath = "./src/AI/data/datasets.json";
    let existingData = [];
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = fileContent.trim() ? JSON.parse(fileContent) : [];
    }
    let newData = existingData.filter(
        (dataset: { input: number[]; output: number[] }) =>
            dataset.input.length === 4 &&
            dataset.output.length === 1 &&
            dataset.output[0] < 1100 &&
            dataset.output[0] > 8
    );
    newData = existingData.filter(
        (dataset: { input: number[]; output: number[] }) =>
            !(dataset.output[0] > 700 && dataset.input[2] < 15000 && dataset.input[3] === 40)
    );
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
};

cleanDataset();
