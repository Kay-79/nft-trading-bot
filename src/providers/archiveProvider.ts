import { ethers } from "ethers";
import { RPC_URL_ARCHIVE } from "../constants/constants";

export const archiveProvider = new ethers.JsonRpcProvider(RPC_URL_ARCHIVE);
