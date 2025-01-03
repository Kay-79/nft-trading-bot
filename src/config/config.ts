import { ModeBot } from "types/common/ModeBot";
import { TierPrice } from "../types/common/TierPrice";

export const modeBot: ModeBot = {
    auction: false,
    auctionGroup: true,
    box: false,
    mexBox: false,
    gem: false
};

export const profitPerTier: TierPrice = {
    1: 0,
    2: 0,
    3: 0,
    4: 3,
    5: 10,
    6: 500
};

export const profitProAI = {
    min: 5,
    percent: 0.8
};

export const traders: string[] = [
    "0x2D02D9fa00eFE096068c733e925035aBB9661e98", //normal traders
    "0x0e9bc747335a4b01a6194a6c1bb1de54a0a5355c", // pro traders
    "0x8C6d06D614aB70a3AB6fAAf7cFF83102D840458b",
    "0x198D66Dc32310579bF041203c8e9d1cc5baeb941",
    "0x9488821c7d84ce4b72c7f85b2ad12b84bacfe7c5",
    "0xE13eBac7c22863396eE16877Aa4A049D671B4FA5",
    "0x8b5da11bd2955569a6408050246f14b5340f61c8",
    "0xbaf0B0F1D4aE45E71650988f054856da5027558C"
];

export const contracts: string[] = [
    "0x179815260f9265950286918fa34b624071E09D68", // getReward()
    "0xfa11AA3953B46c12dC1fB5c880912A80BF52203A",
    "0x891016f99BA622F8556bE12B4EA336157aA6cb20",
    "0xb8C5744D347A74484925E19F588719C846616405",
    "0x838e781DC9F070922F66f0BE415d15168bB04825",
    "0x79791a6D45C4bCcaBf56dF64403d84EEFc4065EC",
    "0x3A2887CEE9096cc90A00619F5fAFA5eeE8FC0e32",
    "0x2D02D9fa00eFE096068c733e925035aBB9661e98" // version 3
];

export const bidContract = "0x2D02D9fa00eFE096068c733e925035aBB9661e98";
