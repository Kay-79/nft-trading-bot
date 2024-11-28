import { ethers } from "ethers";
import { ethersProvider } from "./ethersProvider";
import { abiMp } from "../abi/abiMp";
import { MP_ADDRESS } from "../constants/constants";

export const mpProvider = new ethers.Contract(MP_ADDRESS ?? "", abiMp, ethersProvider);
