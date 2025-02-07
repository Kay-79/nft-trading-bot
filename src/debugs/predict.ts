import { predictModel } from "AI/utils";
import { PredictMode } from "enum/enum";

const getDatasetF = async () => {
    const price = 0.09615258207969471;
    const reward = 0.12718886956974754;
    const timestamp = Math.floor(Date.now() / 1000);
    const momoInfo = [210, 954, 4, 7];
    momoInfo.push(...[timestamp, price, reward]);
    await predictModel(
        momoInfo,
        PredictMode.ONE
        // PredictMode.ALL
    );
};

getDatasetF();
