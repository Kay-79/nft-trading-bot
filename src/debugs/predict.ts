import { predictModel } from "AI/utils";
import { PredictMode } from "enum/enum";

const getDatasetF = async () => {
    let price = 0;
    price += Number(
        await predictModel(
            [91, 91, 4, 1, Math.floor(Date.now() / 1000), 0.1006, 0.1246],
            PredictMode.ONE
            // PredictMode.ALL
        )
    );
};

getDatasetF();
