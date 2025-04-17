import { TierPrice } from "../../types/common/TierPrice";
import { SetupBot } from "../../types/common/SetupBot";
// import { sleep } from "../common/sleep";
// import { getPriceMboxOnChain } from "../pancakeSwap/router";
// import { stakingUtils } from "../staking/utils";
import { getBnbPrice, getTierPrice } from "./utils";

export const setup = async (
    cacheBnbPrice: number,
    cacheTierPrice: TierPrice
): Promise<SetupBot> => {
    const bnbPrice = await getBnbPrice(cacheBnbPrice);
    // await sleep(2);
    // const rewardPer1000Hash = await stakingUtils.getRewardPer1000Hashrate(
    //     -1,
    //     cacheRewardPer1000Hash
    // );
    const floorPrices = await getTierPrice(cacheTierPrice);
    if (!bnbPrice || !floorPrices) {
        console.log("Error: Failed to fetch prices");
        return {
            bnbPrice: cacheBnbPrice,
            isFrontRunNormal: true,
            isFrontRunPro: true,
            isFrontRunProHash: true,
            floorPrices: cacheTierPrice,
            timeLastSetup: Date.now() / 1000
            // mboxPrice: cacheMboxPrice,
            // rewardPer1000Hash: cacheRewardPer1000Hash
        };
    }
    return {
        bnbPrice: bnbPrice,
        isFrontRunNormal: true,
        isFrontRunPro: true,
        isFrontRunProHash: true,
        floorPrices: floorPrices,
        timeLastSetup: Date.now() / 1000
        // mboxPrice: mboxPrice,
        // rewardPer1000Hash: rewardPer1000Hash
    };
};
