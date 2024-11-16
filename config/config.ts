import { TierPrice } from "../types/dtos/TierPrice.dto";

export const ENVIROMENT = process.env.ENVIROMENT;

export const profitPerTier: TierPrice = {
    1: 0.01,
    2: 0.01,
    3: 0.01,
    4: 3,
    5: 8,
    6: 10000
};

export const contracts: string[] = [
    "0x179815260f9265950286918fa34b624071E09D68", // getReward()
    "0xfa11AA3953B46c12dC1fB5c880912A80BF52203A",
    "0x891016f99BA622F8556bE12B4EA336157aA6cb20",
    "0xb8C5744D347A74484925E19F588719C846616405",
    "0x838e781DC9F070922F66f0BE415d15168bB04825",
    "0x79791a6D45C4bCcaBf56dF64403d84EEFc4065EC",
    "0x3A2887CEE9096cc90A00619F5fAFA5eeE8FC0e32"
];

export const bidContract = "0xb8C5744D347A74484925E19F588719C846616405";
