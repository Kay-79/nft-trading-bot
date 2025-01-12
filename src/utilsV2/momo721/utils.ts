import { MOMO721_ADDRESS } from "../../constants/constants";
import { Momo721Selector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder } from "ethers";
import { byte32ToAddress } from "../common/utils";
import { Momo721Info } from "../../types/dtos/Momo721Info.dto";
import { archiveProvider } from "providers/archiveProvider";

const getMomoInfo = async (n: string): Promise<Momo721Info> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [n]);
    const data = Momo721Selector.GET_MOMO_INFO + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    if (result === "0x")
        return {
            prototype: 0n,
            quality: 0n,
            category: 0n,
            level: 0n,
            specialty: 0n,
            hashrate: 0n,
            lvHashrate: 0n
        };
    const decodedResult = abiCoder.decode(
        [
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256"
        ],
        result
    );
    const [, , prototype, quality, category, level, specialty, hashrate, lvHashrate] =
        decodedResult;
    const momo721Info: Momo721Info = {
        prototype,
        quality,
        category,
        level,
        specialty,
        hashrate,
        lvHashrate
    };
    return momo721Info;
};

const getMomoInfoHistory = async (n: string, block: number): Promise<Momo721Info> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [n]);
    const data = Momo721Selector.GET_MOMO_INFO + encodedData.slice(2);
    const result = await archiveProvider.call({
        to: MOMO721_ADDRESS,
        data: data,
        blockTag: block
    });
    if (result === "0x")
        return {
            prototype: 0n,
            quality: 0n,
            category: 0n,
            level: 0n,
            specialty: 0n,
            hashrate: 0n,
            lvHashrate: 0n
        };

    const decodedResult = abiCoder.decode(
        [
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256"
        ],
        result
    );
    const [, , prototype, quality, category, level, specialty, hashrate, lvHashrate] =
        decodedResult;
    const momo721Info: Momo721Info = {
        prototype,
        quality,
        category,
        level,
        specialty,
        hashrate,
        lvHashrate
    };
    return momo721Info;
};

const getPrototypeHashTime = async (id: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [id]);
    const data = Momo721Selector.GET_PROTOTYPE_HASH_TIME + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["uint256", "uint256", "uint256"], result);
    return decodedResult;
};

const getApproved = async (id: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [id]);
    const data = Momo721Selector.GET_APPROVED + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    return result;
};

const getPrototypeHash = async (id: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [id]);
    const data = Momo721Selector.GET_PROTOTYPE_HASH + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["uint256", "uint256"], result);
    return decodedResult;
};

const tokensOfOwner = async (address: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = Momo721Selector.TOKENS_OF_OWNER + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["uint256[]"], result);
    return decodedResult;
};

const balanceOf = async (address: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = Momo721Selector.BALANCE_OF + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    return Number(result);
};

const tokenOfOwnerByIndex = async (address: string, index: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address", "uint256"], [address, index]);
    const data = Momo721Selector.TOKENS_OF_OWNER_BY_INDEX + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    return Number(result);
};

const tokenByIndex = async (index: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [index]);
    const data = Momo721Selector.TOKEN_BY_INDEX + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    return Number(result).toString();
};

const ownerOf = async (id: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [id]);
    const data = Momo721Selector.OWNER_OF + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    return byte32ToAddress(result);
};

export const momo721 = {
    getMomoInfo,
    getMomoInfoHistory,
    getPrototypeHashTime,
    getApproved,
    getPrototypeHash,
    tokensOfOwner,
    balanceOf,
    tokenOfOwnerByIndex,
    tokenByIndex,
    ownerOf
};
