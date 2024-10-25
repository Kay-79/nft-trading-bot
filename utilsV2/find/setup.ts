import { SetupFind } from "../../types/find/SetupFind";
import { getBnbPrice } from "./utils";

export const setup = async (cacheBnbPrice: number): Promise<SetupFind> => {
    const bnbPrice = await getBnbPrice(cacheBnbPrice);
    
    return {
        bnbPrice: bnbPrice,
        isFrontRunNormal: true,
        isFrontRunPro: true,
        isFrontRunProHash: true,
        priceMins: {}
    };
};
