import { CACHE_TIER_PRICE } from "../../constants/constants";
import { SetupFind } from "../../types/find/SetupFind";
import { getBnbPrice, getTierPrice } from "./utils";

export const setup = async (cacheBnbPrice: number): Promise<SetupFind> => {
    const bnbPrice = await getBnbPrice(cacheBnbPrice);
    const floorPrices = await getTierPrice(CACHE_TIER_PRICE);
    return {
        bnbPrice: bnbPrice,
        isFrontRunNormal: true,
        isFrontRunPro: true,
        isFrontRunProHash: true,
        floorPrices: floorPrices,
        timeLastSetup: Date.now() / 1000
    };
};
