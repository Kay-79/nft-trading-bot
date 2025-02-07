import { TierPrice } from "../common/TierPrice";

export interface SetupFind {
    bnbPrice?: number;
    isFrontRunNormal?: boolean;
    isFrontRunPro?: boolean;
    isFrontRunProHash?: boolean;
    floorPrices?: TierPrice;
    timeLastSetup?: number;
    mboxPrice?: number;
    rewardPer1000Hash?: number;
}
