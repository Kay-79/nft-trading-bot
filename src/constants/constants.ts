import { Environment } from "../enum/enum";
import { TierPrice } from "../types/common/TierPrice";
import { GasPrices } from "../types/gas/GasPrices";

export const ENV = process.env.ENV || Environment.TESTNET; // Default TESTNET

console.log("Current ENV:", ENV); // Add this line to debug the value of ENV

export const TOPIC_BID = process.env.TOPIC_BID || "default_topic";

export const TOPIC_CANCEL = process.env.TOPIC_CANCEL || "default_topic";

export const TOPIC_CHANGE = process.env.TOPIC_CHANGE || "default_topic";

export const TOPIC_HASH = process.env.TOPIC_HASH || "default_topic";

export const TOPIC_CREATE = process.env.TOPIC_CREATE || "default_topic";

export const TOPPICS: string[] = [TOPIC_BID, TOPIC_CANCEL, TOPIC_CHANGE, TOPIC_HASH, TOPIC_CREATE];

export const API_MOBOX = "https://nftapi.mobox.io";

export const EXPLORER_URL =
    ENV === Environment.MAINNET ? "https://bscscan.com" : "https://testnet.bscscan.com";

export const API_TELEGRAM = process.env.API_TELEGRAM || "default_api";

export const CHATID_MOBOX = process.env.CHATID_MOBOX || "default_chatid";

export const GAS_ESTIMATE_PRICES_BID: GasPrices = {
    proAuction: 250000,
    bundleAuction: 350000,
    normalAuction: { 1: 250000, 2: 300000, 3: 325000, 4: 350000, 5: 450000, 6: 500000 },
    auctionGroup: {
        bep721: {
            3: NaN,
            4: NaN,
            5: NaN,
            6: NaN,
            7: NaN,
            8: NaN,
            9: NaN,
            10: NaN
        },
        crew: {
            3: 431390,
            4: NaN,
            5: NaN,
            6: NaN,
            7: NaN,
            8: NaN,
            9: NaN,
            10: NaN
        },
        default: 1000000
    }
};

export const GAS_LIMIT_BID = 1000000;

export const GAS_LIMIT_BID_BLOCK = 2000000;

export const GAS_LIMIT_LIST = 54166; // 325000 / 6;

export const GAS_LIMIT_CHANGE = 57865;

export const RATE_FEE_MARKET = 0.05;

export const RPC_URL =
    ENV === Environment.MAINNET
        ? "https://bsc-dataseed.binance.org/"
        : "https://data-seed-prebsc-1-s1.binance.org:8545/";

export const RPC_URL_ARCHIVE = process.env.MORALIST_RPC_ARCHIVE_NODE || "default_rpc_archive";

export const RPC_URL_FULL_NODE = process.env.GET_BLOCK_RPC_FULL_NODE || "default_rpc_full_node";

export const MIN_GAS_PRICE_NORMAL = ENV === Environment.MAINNET ? 1.0001 : 10;

export const MIN_GAS_PRICE_PRO = ENV === Environment.MAINNET ? 3.002 : 10;

export const MIN_GAS_PRICE_CHANGE = ENV === Environment.MAINNET ? 0 : 10;

export const MP_ADDRESS =
    ENV === Environment.MAINNET
        ? "0xcb0cffc2b12739d4be791b8af7fbf49bc1d6a8c2"
        : "0xCCCC9D44B0A3e6d01eE204849d195f2422dcD437";

export const MP_BLOCK_ADDRESS =
    ENV === Environment.MAINNET
        ? "0x1d4d9706b057a945fce86ee53b8894bd17ffa0de"
        : "0xBBBBD0DE58A5964d183b855A1626795Df7E894aD";

export const STAKING_ADDRESS =
    ENV === Environment.MAINNET
        ? "0x3bD6a582698ECCf6822dB08141818A1a8512c68D"
        : "0x0000000000000000000000000000000000000000";

export const MINT_MOMO_ADDRESS =
    ENV === Environment.MAINNET
        ? "0x1da9b6e37f006dD349089dEA21cb8261391593D5"
        : "0x0000000000000000000000000000000000000000";

export const MOMO721_ADDRESS =
    ENV === Environment.MAINNET
        ? "0x4eeDeDfe89dad70aB8cbf70E4dD140Ff8E6e8ce5"
        : "0x0000000000000000000000000000000000000000";

export const MOMO1155_ADDRESS =
    ENV === Environment.MAINNET
        ? "0xb3e968ba01a78ea489292130bcf8bbe6a64be648"
        : "0x0000000000000000000000000000000000000000";

export const USDT_ADDRESS =
    ENV === Environment.MAINNET
        ? "0x55d398326f99059fF775485246999027B3197955"
        : "0x190B955CE93deDACA9E3Dcc06BF19BF025B194C6";

export const MBOX_ADDRESS =
    ENV === Environment.MAINNET
        ? "0x3203c9e46ca618c8c1ce5dc67e7e9d75f5da2377"
        : "0x0000000000000000000000000000000000000000";

export const WBNB_ADDRESS =
    ENV === Environment.MAINNET
        ? "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
        : "0x0000000000000000000000000000000000000000";

export const NORMAL_BUYER =
    ENV === Environment.MAINNET
        ? process.env.NORMAL_BUYER_MAINNET || "0x0000000000000000000000000000000000000000"
        : process.env.NORMAL_BUYER_TESTNET || "0x0000000000000000000000000000000000000000";

export const PRO_BUYER =
    ENV === Environment.MAINNET
        ? process.env.PRO_BUYER_MAINNET || "0x0000000000000000000000000000000000000000"
        : process.env.PRO_BUYER_TESTNET || "0x0000000000000000000000000000000000000000";

export const CHANGER =
    ENV === Environment.MAINNET
        ? process.env.CHANGER_MAINNET || "0x0000000000000000000000000000000000000000"
        : process.env.CHANGER_TESTNET || "0x0000000000000000000000000000000000000000";

export const PRIVATE_KEY_BID =
    ENV === Environment.MAINNET
        ? process.env.PRIVATE_KEY_BID_MAINNET || "0x"
        : process.env.PRIVATE_KEY_BID_TESTNET || "0x";

export const PRIVATE_KEY_BID_PRO =
    ENV === Environment.MAINNET
        ? process.env.PRIVATE_KEY_BID_PRO_MAINNET || "0x"
        : process.env.PRIVATE_KEY_BID_PRO_TESTNET || "0x";

export const PRIVATE_KEY_CHANGE =
    ENV === Environment.MAINNET
        ? process.env.PRIVATE_KEY_CHANGE_MAINNET || "0x"
        : process.env.PRIVATE_KEY_CHANGE_TESTNET || "0x";

export const API_BNB_PRICE_COIGEKO =
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd";

export const API_BNB_PRICE_MOBOX = "https://priceapi.mobox.io/kline/usdt?coins=[%22bnb%22]";

export const TIME_DELAY_SETUP_FIND = 1800; //30mins

export const TIME_DELAY_SETUP_CHANGE = 1800; //30mins

export const MIN_TIME_GET_PRICE = 600; //10mins

export const CACHE_BNB_PRICE = 999;

export const CACHE_MBOX_PRICE = 0.1;

export const CACHE_REWARD_PER_1000_HASH = 0.127;

export const CACHE_TIER_PRICE: TierPrice = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
};

export const TIME_PER_BLOCK = 3;

export const TIME_ENABLE_BID_AUCTION = 120; //2mins

export const TIME_ENABLE_BID_AUCTION_GROUP = 600; //10mins

export const TIME_DISABLE_BID = 3600; //1hour

export const TIME_DELAY_NOTICE_STATUS_BOT = 4; //4hours

export const IS_FRONT_RUNNING = false;

export const WAIT_BID_PATH = "./src/data/waitBid.json";

export const IP_WIN = "172.16.1.91";

export const IP_MAC = "100.92.200.100";

export const IP_PI_BOX = "192.168.1.9";

export const IP_PI_BOT = "192.168.1.11";

export const PORT_HOST_DATASET = 3004;

export const API_AI_PRICE_PREDICT = "http://localhost:5000/predict";

export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
