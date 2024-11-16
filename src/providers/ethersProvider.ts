import { ethers } from "ethers";
import { RPC_URL } from "../constants/constants";

export const ethersProvider = new ethers.JsonRpcProvider(RPC_URL);
