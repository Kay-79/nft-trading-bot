import { ethers } from "ethers";
import { ethersProvider } from "./ethersProvider";
import { abiMomo } from "../abi/abiMomo";
import { STAKING_ADDRESS } from "../constants/constants";

export const momoProvider = new ethers.Contract(STAKING_ADDRESS ?? "", abiMomo, ethersProvider);
