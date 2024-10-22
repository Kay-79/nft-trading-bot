import { GasPrices } from "../types/gas/GasPrices";

export const TOPPICS: string[] = [
    process.env.TOPIC_CREATE || "default_topic",
    process.env.TOPIC_BID || "default_topic",
    process.env.TOPIC_CANCEL || "default_topic",
    process.env.TOPIC_CHANGE || "default_topic",
    process.env.TOPIC_HASH || "default_topic"
];

export const API_DOMAIN = process.env.API_DOMAIN || "https://api.mobox.io";

export const GAS_PRICES: GasPrices = {
    proAuction: 250000,
    bundleAuction: 350000,
    normalAuction: { 1: 250000, 2: 300000, 3: 325000, 4: 350000, 5: 450000, 6: 500000 }
};

export const MP_ADDRESS = process.env.ADDRESS_MP || "0xADDRESS_MP";

export const NORMAL_BUYER = process.env.NORMAL_BUYER || "0xNORMAL_BUYER";

export const PRO_BUYER = process.env.PRO_BUYER || "0xPRO_BUYER";
