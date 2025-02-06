import { predictModel } from "AI/utils";
import { PredictMode } from "enum/enum";

const getDatasetF = async () => {
    const price = 0.0963;
    const reward = 0.1274;
    const timestamp = Math.floor(Date.now() / 1000);
    const momoInfo = [354, 930, 4, 4];
    momoInfo.push(...[timestamp, price, reward]);
    await predictModel(
        momoInfo,
        PredictMode.ONE
        // PredictMode.ALL
    );
};

getDatasetF();
