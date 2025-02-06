import { sleep } from "utilsV2/common/sleep";
import { TierPrice } from "../../types/common/TierPrice";
import { SetupFind } from "../../types/find/SetupFind";
import { getBnbPrice, getTierPrice } from "./utils";

export const setup = async (
    cacheBnbPrice: number,
    cacheTierPrice: TierPrice
): Promise<SetupFind> => {
    const bnbPrice = await getBnbPrice(cacheBnbPrice);
    await sleep(2);
    const floorPrices = await getTierPrice(cacheTierPrice);
    return {
        bnbPrice: bnbPrice,
        isFrontRunNormal: true,
        isFrontRunPro: true,
        isFrontRunProHash: true,
        floorPrices: floorPrices,
        timeLastSetup: Date.now() / 1000
    };
};
