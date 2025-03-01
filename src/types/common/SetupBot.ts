import { TierPrice } from "./TierPrice";

export interface SetupBot {
    bnbPrice?: number;
    isFrontRunNormal?: boolean;
    isFrontRunPro?: boolean;
    isFrontRunProHash?: boolean;
    floorPrices?: TierPrice;
    timeLastSetup?: number;
    mboxPrice?: number;
    rewardPer1000Hash?: number;
}
