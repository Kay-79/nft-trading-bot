import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { Enviroment } from "./src/enum/enum";

dotenv.config();

const PRIVATE_KEY =
    process.env.ENVIRONMENT === Enviroment.MAINNET
        ? process.env.PRIVATE_KEY_BID_MAINNET
        : process.env.PRIVATE_KEY_BID_TESTNET;

const GAS_PRICE_DEPLOY = process.env.ENVIRONMENT === Enviroment.MAINNET ? 1 : 6;

const RPC_URL =
    process.env.ENVIRONMENT === Enviroment.MAINNET
        ? "https://bsc-dataseed.binance.org/"
        : "https://data-seed-prebsc-1-s1.binance.org:8545/";

const chainId = process.env.ENVIRONMENT === Enviroment.MAINNET ? 56 : 97;

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337
        },
        bsc: {
            url: RPC_URL ? RPC_URL : "",
            chainId: chainId,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            gasPrice: GAS_PRICE_DEPLOY * 10 ** 9
        }
    }
};

export default config;
