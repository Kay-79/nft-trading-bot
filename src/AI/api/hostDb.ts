import express from "express";
import cors from "cors";
import fs from "fs";
import { PORT_HOST_DATASET } from "@/constants/constants";

const app = express();
const PORT = PORT_HOST_DATASET;
const filePath = "./src/AI/data/datasets.json";
const data = fs.readFileSync(filePath, "utf-8");

app.use(cors());
app.use(express.json());

app.get("/dataset", (req: express.Request, res: express.Response) => {
    console.log("GET /dataset");
    try {
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Error reading dataset:", error);
        res.status(500).json({ error: "Error reading dataset." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
