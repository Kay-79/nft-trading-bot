import { ethers } from "ethers";
import { bidContract } from "../config/config";
import { ethersProvider } from "./ethersProvider";
import { abiMobox } from "../abi/abiMobox";
import { MP_ADDRESS } from "../constants/constants";

// export const contractProvider = new ethers.Contract(bidContract, abiMobox, ethersProvider);
export const contractProvider = new ethers.Contract(MP_ADDRESS ?? "", abiMobox, ethersProvider);
