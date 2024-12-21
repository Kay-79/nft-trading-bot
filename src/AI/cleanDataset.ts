import fs from "fs";

export const cleanDataset = async () => {
    const filePath = "./src/AI/data/datasets.json";
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
            dataset.bidder !== "0x198d66dc32310579bf041203c8e9d1cc5baeb941"&&
            dataset.output[0] > 7 &&
            dataset.output[0] < 1100
    );
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
};

cleanDataset();
