import { TierPrice } from "../types/dtos/TierPrice.dto";
import { GasPrices } from "../types/gas/GasPrices";

export const TOPPICS: string[] = [
    process.env.TOPIC_CREATE || "default_topic",
    process.env.TOPIC_BID || "default_topic",
    process.env.TOPIC_CANCEL || "default_topic",
    process.env.TOPIC_CHANGE || "default_topic",
    process.env.TOPIC_HASH || "default_topic"
];

export const API_DOMAIN = process.env.API_DOMAIN || "https://nftapi.mobox.io";

export const GAS_PRICES_BID: GasPrices = {
    proAuction: 250000,
    bundleAuction: 350000,
    normalAuction: { 1: 250000, 2: 300000, 3: 325000, 4: 350000, 5: 450000, 6: 500000 }
};

export const GAS_PRICE_LIST = 325000 / 6;

export const RATE_FEE_MARKET = 0.05;

export const MP_ADDRESS = process.env.ADDRESS_MP || "0xADDRESS_MP";

export const NORMAL_BUYER = process.env.NORMAL_BUYER || "0xNORMAL_BUYER";

export const PRO_BUYER = process.env.PRO_BUYER || "0xPRO_BUYER";

export const CACHE_BNB_PRICE = 600;

export const API_BNB_PRICE_COIGEKO =
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd";

export const API_BNB_PRICE_MOBOX = "https://priceapi.mobox.io/kline/usdt?coins=[%22bnb%22]";

export const TIME_DELAY_SETUP_FIND = 1800; //30mins

export const MIN_TIME_GET_PRICE = 600; //10mins

export const CACHE_TIER_PRICE: TierPrice = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
};

export const MIN_GAS_PRICE = 1.001;

export const TIME_DELAY_BLOCK_BID = 600; //1min

export const IS_FRONT_RUNNING = false;
