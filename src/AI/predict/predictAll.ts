import { getMboxPriceAndRewardDelay1Hour, predictModel } from "@/AI/utils";
import { PredictMode } from "@/enum/enum";

const predictAll = async () => {
    const data = await getMboxPriceAndRewardDelay1Hour();
    const mboxPrice = data.mboxPrice;
    const reward = data.reward;
    const momoInfo = [0, 0, 0, 0];
    momoInfo.push(...[Math.floor(Date.now() / 1000), mboxPrice, reward]);
    await predictModel(momoInfo, PredictMode.ALL);
};

predictAll();
