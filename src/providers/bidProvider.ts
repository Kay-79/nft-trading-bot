import { ethers } from "ethers";
import { bidContract } from "../config/config";
import { ethersProvider } from "./ethersProvider";
import { abiBid } from "../abi/abiBid";

export const bidProvider = new ethers.Contract(bidContract, abiBid, ethersProvider);
