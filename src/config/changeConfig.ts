import { ModeChange } from "@/types/common/ModeChange";

export const modeChange: ModeChange = {
    normal: true,
    pro: false,
    bundle: false,
    block: false
};

export const priceDelta = 0.005;

export const priceDeltaMin = 0.001;

export const priceThreshold = 0.15;

export const minTimeListedMyAuctionToChange = 2 * 60 * 60;

export const minTimeListedOtherAuctionToChange = 1 * 60 * 60;
