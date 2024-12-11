import { TrainingData } from "types/AI/TrainingData";
import fs from "fs";
import { API_MOBOX, PRO_BUYER } from "constants/constants";
import axios from "axios";
import { RecentSold } from "types/dtos/TopAuction.dto";
import { preprocessRawData } from "./utils";
import { sleep } from "utilsV2/common/sleep";

export const crawlingDatasetsApi = async () => {
    let cacheTimeInSec = Date.now() / 1000;
    const interval = 1800;
    while (true) {
        let datasets = fs.readFileSync("./src/AI/data/datasets.json", "utf-8");
        let trainingDatasets: TrainingData[] = JSON.parse(datasets);
        console.log("Crawling datasets...");
        // Crawling datasets
        const data = await axios.get(`${API_MOBOX}/auction/logs_new`);
        const rawDatasets: RecentSold[] = data.data.list;
        const finalDatasets = [];
        for (const dataset of [...rawDatasets].reverse()) {
            if (
                !dataset.tx ||
                (dataset.crtime ?? 0) <= cacheTimeInSec ||
                dataset.bidder?.toLowerCase() === PRO_BUYER
            )
                continue;
            finalDatasets.push(dataset);
        }
        cacheTimeInSec = rawDatasets[0].crtime ?? Date.now() / 1000;
        if (finalDatasets.length === 0) {
            console.log("No new datasets, waiting for", interval, "seconds...");
            await sleep(interval);
            continue;
        }
        trainingDatasets.push(...preprocessRawData(finalDatasets));
        fs.writeFileSync("./src/AI/data/datasets.json", JSON.stringify(trainingDatasets));
        console.log("Crawling datasets done, waiting for next", interval, "seconds...");
        await sleep(interval);
    }
};
