import { getMboxPriceAndRewardDelay5m, predictModel } from "@/AI/utils";
import { PredictMode } from "@/enum/enum";

const predictOne = async () => {
    const data = await getMboxPriceAndRewardDelay5m();
    const mboxPrice = data.mboxPrice;
    const reward = data.reward;
    const momoInfo = [396, 10074, 5, 36];
    momoInfo.push(...[Math.floor(Date.now() / 1000), mboxPrice, reward]);
    await predictModel(momoInfo, PredictMode.ONE);
};

predictOne();
