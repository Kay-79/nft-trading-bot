import { ethers } from "ethers";
import { ethersProvider } from "./ethersProvider";
import { abiMomo } from "../abi/abiMomo";
import { MOMO_ADDRESS } from "../constants/constants";

export const momoProvider = new ethers.Contract(MOMO_ADDRESS ?? "", abiMomo, ethersProvider);
