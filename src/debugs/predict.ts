import { predictModel } from "AI/utils";
import { PredictMode } from "enum/enum";

const getDatasetF = async () => {
    let price = 0;
    price += Number(
        await predictModel(
            [391, 391, 4, 1, Math.floor(Date.now() / 1000), 0.0983, 0.1246],
            PredictMode.ONE
            // PredictMode.ALL
        )
    );
};

getDatasetF();
