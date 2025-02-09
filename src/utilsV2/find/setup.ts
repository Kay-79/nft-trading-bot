import { sleep } from "utilsV2/common/sleep";
import { TierPrice } from "../../types/common/TierPrice";
import { SetupFind } from "../../types/find/SetupFind";
import { getBnbPrice, getTierPrice } from "./utils";
import { getPriceMboxOnChain } from "utilsV2/pancakeSwap/router";
import { stakingUtils } from "utilsV2/staking/utils";

export const setup = async (
    cacheBnbPrice: number,
    cacheTierPrice: TierPrice,
    cacheMboxPrice: number,
    cacheRewardPer1000Hash: number
): Promise<SetupFind> => {
    const bnbPrice = await getBnbPrice(cacheBnbPrice);
    await sleep(2);
    const mboxPrice = await getPriceMboxOnChain(-1, cacheMboxPrice);
    await sleep(2);
    const rewardPer1000Hash = await stakingUtils.getRewardPer1000Hashrate(-1, cacheRewardPer1000Hash);
    const floorPrices = await getTierPrice(cacheTierPrice);
    return {
        bnbPrice: bnbPrice,
        isFrontRunNormal: true,
        isFrontRunPro: true,
        isFrontRunProHash: true,
        floorPrices: floorPrices,
        timeLastSetup: Date.now() / 1000,
        mboxPrice: mboxPrice,
        rewardPer1000Hash: rewardPer1000Hash
    };
};
