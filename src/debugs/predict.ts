import { predictModel } from "@/AI/utils";
import { PredictMode } from "@/enum/enum";

const getDatasetF = async () => {
    const price = 0.124;
    const reward = 0.1256;
    const timestamp = Math.floor(Date.now() / 1000);
    const momoInfo = [228, 3453, 4, 24];
    momoInfo.push(...[timestamp, price, reward]);
    await predictModel(
        momoInfo,
        PredictMode.ONE
        // PredictMode.ALL
    );
};

getDatasetF();
