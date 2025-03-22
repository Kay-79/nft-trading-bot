import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { ENV, MIN_GAS_PRICE_CHANGE, RPC_URL } from "./src/constants/constants";
import { Environment } from "./src/enum/enum";
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY =
    ENV === Environment.MAINNET
        ? process.env.PRIVATE_KEY_BID_MAINNET
        : process.env.PRIVATE_KEY_BID_TESTNET;

if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set");
}

const chainId = ENV === Environment.MAINNET ? 56 : 97;

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
            gasPrice: MIN_GAS_PRICE_CHANGE * 10 ** 9
        }
    }
};

export default config;
