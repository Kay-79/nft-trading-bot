import { CACHE_TIER_PRICE } from "../../config/constans";
import { SetupFind } from "../../types/find/SetupFind";
import { getBnbPrice, getTierPrice } from "./utils";

export const setup = async (cacheBnbPrice: number): Promise<SetupFind> => {
    const bnbPrice = await getBnbPrice(cacheBnbPrice);
    const priceMins = await getTierPrice(CACHE_TIER_PRICE);
    return {
        bnbPrice: bnbPrice,
        isFrontRunNormal: true,
        isFrontRunPro: true,
        isFrontRunProHash: true,
        priceMins: priceMins,
        timeLastSetup: Date.now() / 1000
    };
};
