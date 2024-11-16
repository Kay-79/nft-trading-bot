import { ethers } from "ethers";
import { RPC_URL } from "../constans/constans";

export const ethersProvider = new ethers.JsonRpcProvider(RPC_URL);
