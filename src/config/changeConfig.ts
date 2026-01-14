import { ModeChange } from "@/types/common/ModeChange";

export const modeChange: ModeChange = {
    normal: true,
    pro: false,
    bundle: false,
    block: false
};

export const priceDelta = 0.005;

export const priceDeltaMin = 0.001;

export const priceThreshold = 0.02;

export const minTimeListedMyAuctionToChange = {
    normal: 1.5 * 60 * 60,
    pro: { up: 6 * 60 * 60, down: 6 * 60 * 60 },
    bundle: 24 * 60 * 60
};

export const boostPrice = 1; // require > 1 to boost

export const minTimeListedOtherAuctionToChange = 1 * 60 * 60;
