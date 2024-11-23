import { FunctionFragment } from "../../enum/enum";
import { contractProvider } from "../../providers/contractProvider";
import { ethersProvider } from "../../providers/ethersProvider";
import { getBlockByTimestamp } from "../bid/utils";

export const decodeFunctionData = (functionFragment: string, data: string) => {
    return contractProvider.interface.decodeFunctionData(functionFragment, data);
};

export const shortenAddress = (address: string, prefix = 6, suffix = 4) => {
    return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
};

export const addressTo32Bytes = (address: string) => {
    return "0x" + address.slice(2, 42).padStart(64, "0").toLowerCase();
};

export const checkDelayBlockTransaction = async (txHash: string): Promise<number> => {
    const tx = await ethersProvider.provider.getTransaction(txHash);
    if (!tx) {
        return -1;
    }
    let prams = [];
    try {
        prams = decodeFunctionData(FunctionFragment.BID, tx.data);
    } catch (error) {
        prams = decodeFunctionData(FunctionFragment.BID_BATCH, tx.data);
    }
    const tagetBlock = (await getBlockByTimestamp(prams[2])) + 40;
    // console.log(prams[2]);
    return tx.blockNumber ? tx.blockNumber - tagetBlock : -1;
};
