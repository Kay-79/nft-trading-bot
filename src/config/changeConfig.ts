import { ModeChange } from "@/types/common/ModeChange";

export const modeChange: ModeChange = {
    normal: true,
    pro: false,
    bundle: false,
    block: false
};

export const priceDelta = 0.005;

export const priceThreshold = 0.15;

export const minTimeListedToChange = 2 * 60 * 60;