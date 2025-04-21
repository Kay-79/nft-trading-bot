import { ethers } from "ethers";
import { bidContract } from "@/config/config";
import { abiBid } from "@/abi/abiBid";
import { ethersProvider } from "./ethersProvider";

export const bidProvider = new ethers.Contract(bidContract, abiBid, ethersProvider);
