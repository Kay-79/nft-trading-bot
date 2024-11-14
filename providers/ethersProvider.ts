import { ethers } from "ethers";

const RPC_URL =
    process.env.ENVIRONMENT === "TESTNET"
        ? "https://data-seed-prebsc-1-s1.binance.org:8545/"
        : "https://bsc-dataseed.binance.org/";

export const ethersProvider = new ethers.JsonRpcProvider(RPC_URL);
