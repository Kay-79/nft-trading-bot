import { ethers } from "ethers";
import { bidContract } from "../config/config";
import { ethersProvider } from "./ethersProvider";
import { abiMobox } from "../abi/abiMobox";

export const contractProvider = new ethers.Contract(bidContract, abiMobox, ethersProvider);
