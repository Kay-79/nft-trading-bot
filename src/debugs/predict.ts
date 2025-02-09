import { predictModel } from "AI/utils";
import { PredictMode } from "enum/enum";

const getDatasetF = async () => {
    const price = 0.11125;
    const reward = 0.1267;
    const timestamp = Math.floor(Date.now() / 1000);
    const momoInfo = [181, 1615, 4, 14];
    momoInfo.push(...[timestamp, price, reward]);
    await predictModel(
        momoInfo,
        // PredictMode.ONE
        PredictMode.ALL
    );
};

getDatasetF();
