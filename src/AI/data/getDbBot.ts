import axios from "axios";
import { PORT_HOST_DATASET, IP_PY_BOX } from "@/constants/constants";
import fs from "fs";
import path from "path";

const API_URL = `http://${IP_PY_BOX}:${PORT_HOST_DATASET}/dataset`;
const OUTPUT_FILE = "./src/AI/data/datasets.json";

const fetchAndSaveDataset = async () => {
    try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
            const data = response.data;
            const dir = path.dirname(OUTPUT_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), "utf-8");
            console.log(`Dataset has been saved to ${OUTPUT_FILE}`);
        } else {
            console.error(`Failed to fetch dataset. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching or saving dataset:", error);
    }
};

fetchAndSaveDataset();
