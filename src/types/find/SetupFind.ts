import { TierPrice } from "../common/TierPrice";

export interface SetupFind {
    bnbPrice?: number;
    isFrontRunNormal?: boolean;
    isFrontRunPro?: boolean;
    isFrontRunProHash?: boolean;
    floorPrices?: TierPrice;
    timeLastSetup?: number;
}
