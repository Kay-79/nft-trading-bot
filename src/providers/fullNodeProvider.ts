import { ethers } from "ethers";
import { RPC_URL_FULL_NODE } from "../constants/constants";

export const fullNodeProvider = new ethers.JsonRpcProvider(RPC_URL_FULL_NODE);
