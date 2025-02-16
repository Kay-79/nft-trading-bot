import { getMboxPriceAndRewardDelay5m, predictListingsPro } from "@/AI/utils";

const predictPro = async () => {
    const data = await getMboxPriceAndRewardDelay5m();
    const mboxPrice = data.mboxPrice;
    const reward = data.reward;
    await predictListingsPro(mboxPrice, reward);
};

predictPro();
