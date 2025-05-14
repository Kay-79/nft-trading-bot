import { ModeChange } from "@/types/common/ModeChange";

export const modeChange: ModeChange = {
    normal: true,
    pro: true,
    bundle: false,
    block: false
};

export const priceDelta = 0.005;

export const priceDeltaMin = 0.001;

export const priceThreshold = 0.15;

export const minTimeListedMyAuctionToChange = {
    normal: 4 * 60 * 60,
    pro: { up: 10 * 60 * 60, down: 10 * 60 * 60 },
    bundle: 24 * 60 * 60
};

export const boostPrice = 1; // require > 1 to boost

export const minTimeListedOtherAuctionToChange = 1 * 60 * 60;
