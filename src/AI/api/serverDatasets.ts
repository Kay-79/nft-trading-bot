import express from "express";
import cors from "cors";
import fs from "fs";
import { PORT_HOST_DATASET } from "constants/constants";

const app = express();
const PORT = PORT_HOST_DATASET;

app.use(cors());
app.use(express.json());

app.get("/dataset", (req: any, res: any) => {
    const filePath = "./src/AI/data/datasets.json";
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Dataset not found." });
    }
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Error reading dataset:", error);
        res.status(500).json({ error: "Error reading dataset." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
