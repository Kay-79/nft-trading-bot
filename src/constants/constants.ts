import { Environment } from "../enum/enum";
import { TierPrice } from "../types/dtos/TierPrice.dto";
import { GasPrices } from "../types/gas/GasPrices";

export const ENV = process.env.ENV || Environment.TESTNET; // Default TESTNET

export const TOPPICS: string[] = [
    process.env.TOPIC_CREATE || "default_topic",
    process.env.TOPIC_BID || "default_topic",
    process.env.TOPIC_CANCEL || "default_topic",
    process.env.TOPIC_CHANGE || "default_topic",
    process.env.TOPIC_HASH || "default_topic"
];

export const API_DOMAIN = process.env.API_DOMAIN || "https://nftapi.mobox.io";

export const EXPLORER_URL =
    ENV === Environment.MAINNET ? "https://bscscan.com/tx/" : "https://testnet.bscscan.com/tx/";

export const API_TELEGRAM = process.env.API_TELEGRAM || "default_api";

export const CHATID_MOBOX = process.env.CHATID_MOBOX || "default_chatid";

export const GAS_PRICES_BID: GasPrices = {
    proAuction: 250000,
    bundleAuction: 350000,
    normalAuction: { 1: 250000, 2: 300000, 3: 325000, 4: 350000, 5: 450000, 6: 500000 }
};

export const GAS_PRICE_BID = 1000000;

export const GAS_PRICE_LIST = 325000 / 6;

export const RATE_FEE_MARKET = 0.05;

export const RPC_URL =
    process.env.ENV === Environment.MAINNET
        ? "https://bsc-dataseed.binance.org/"
        : "https://data-seed-prebsc-1-s1.binance.org:8545/";

export const MIN_GAS_PRICE = ENV === Environment.MAINNET ? 1.0001 : 6;

export const MP_ADDRESS =
    ENV === Environment.MAINNET
        ? process.env.ADDRESS_MP_MAINNET
        : process.env.ADDRESS_MP_TESTNET || "0x";

export const USDT_ADDRESS =
    ENV === Environment.MAINNET
        ? "0x55d398326f99059fF775485246999027B3197955"
        : "0x221c5B1a293aAc1187ED3a7D7d2d9aD7fE1F3FB0";

export const NORMAL_BUYER =
    ENV === Environment.MAINNET
        ? process.env.NORMAL_BUYER_MAINNET
        : process.env.NORMAL_BUYER_TESTNET;

export const PRIVATE_KEY_BID =
    ENV === Environment.MAINNET
        ? process.env.PRIVATE_KEY_BID_MAINNET
        : process.env.PRIVATE_KEY_BID_TESTNET;

export const PRIVATE_KEY_BID_PRO =
    ENV === Environment.MAINNET
        ? process.env.PRIVATE_KEY_BID_PRO_MAINNET
        : process.env.PRIVATE_KEY_BID_PRO_TESTNET;

export const PRO_BUYER =
    ENV === Environment.MAINNET ? process.env.PRO_BUYER_MAINNET : process.env.PRO_BUYER_TESTNET;

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

export const TIME_DELAY_BLOCK_BID = 60; //1min

export const IS_FRONT_RUNNING = false;

export const WAIT_BID_PATH = "./src/data/waitBid.json";
