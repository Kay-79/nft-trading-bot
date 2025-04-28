import { FunctionFragment, TierColor } from "@/enum/enum";
import { bidProvider } from "@/providers/bidProvider";
import { ethersProvider } from "@/providers/ethersProvider";
import { getBlockByTimestamp } from "../bid/utils";
import { archiveProvider } from "@/providers/archiveProvider";

export const decodeFunctionData = (functionFragment: string, data: string) => {
    return bidProvider.interface.decodeFunctionData(functionFragment, data);
};

export const shortenAddress = (address: string, prefix = 6, suffix = 4) => {
    return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
};

export const addressTo32Bytes = (address: string) => {
    return "0x" + address.slice(2, 42).padStart(64, "0").toLowerCase();
};

export const checkDelayBlockTransaction = async (txHash: string): Promise<number> => {
    if (txHash.length !== 66) {
        console.error("Invalid txHash length");
        return -1;
    }
    const tx = await ethersProvider.provider.getTransaction(txHash);
    if (!tx) {
        console.error("Invalid txHash");
        return -1;
    }
    let prams = [];
    let timeStamp = 0;
    try {
        prams = decodeFunctionData(FunctionFragment.BID, tx.data);
        timeStamp = prams[2];
    } catch {
        prams = decodeFunctionData(FunctionFragment.BID_BATCH, tx.data);
        timeStamp = prams[2][0];
    }
    const tagetBlock = (await getBlockByTimestamp(timeStamp, 1000)) + 40;
    return tx.blockNumber ? tx.blockNumber - tagetBlock : -1;
};

export const shortenNumber = (value: number, decimals: number, round: number): string => {
    const result = value / 10 ** decimals;
    return result.toFixed(round).replace(/\.?0*$/, "");
};

export const byte32ToAddress = (byte32: string) => {
    return "0x" + byte32.slice(26);
};

export const getImplementAddressOfProxy = async (address: string) => {
    const implementAddress = byte32ToAddress(
        await ethersProvider.getStorage(
            address,
            "0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC"
        )
    );
    if (Number(implementAddress) === 0) {
        return "Not implement";
    }
    return implementAddress;
};

export const getDataStorage = async (address: string, slot: string) => {
    return ethersProvider.getStorage(address, slot);
};

export const getDataStorageHistory = async (address: string, slot: string, block: number) => {
    return archiveProvider.getStorage(address, slot, block);
};

export const hexToString = (hex: string): string => {
    return Buffer.from(hex.slice(2), "hex").toString();
};

export const checkMyIp = async () => {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
};

export const getTierMomo = (prototype: number) => {
    return prototype >= 10000 && prototype <= 19999
        ? TierColor.COMMON
        : prototype <= 29999
        ? TierColor.UNCOMMON
        : prototype <= 39999
        ? TierColor.UNIQUE
        : prototype <= 49999
        ? TierColor.RARE
        : prototype <= 59999
        ? TierColor.EPIC
        : TierColor.LEGENDARY;
};
