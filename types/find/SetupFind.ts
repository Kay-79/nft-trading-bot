import { TierPrice } from "../dtos/TierPrice.dto";

export interface SetupFind {
    bnbPrice?: number;
    isFrontRunNormal?: boolean;
    isFrontRunPro?: boolean;
    isFrontRunProHash?: boolean;
    priceMins?: TierPrice;
}
