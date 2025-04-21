import { ethers } from "ethers";
import { ethersProvider } from "./ethersProvider";
import { USDT_ADDRESS } from "../constants/constants";
import { abiERC20 } from "../abi/abiERC20";

export const erc20Provider = new ethers.Contract(USDT_ADDRESS, abiERC20, ethersProvider);
