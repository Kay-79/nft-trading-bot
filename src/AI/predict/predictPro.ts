import { getMboxPriceAndRewardDelay1Hour, predictListingsPro } from "@/AI/utils";

const predictPro = async () => {
    const data = await getMboxPriceAndRewardDelay1Hour();
    const mboxPrice = data.mboxPrice;
    const reward = data.reward;
    await predictListingsPro(mboxPrice, reward);
};

predictPro();
