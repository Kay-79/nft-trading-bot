import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY_BID_TESTNET;

const GAS_PRICE_DEPLOY = 6;

const chainId = 97;

const RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";

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
