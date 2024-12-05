import { token } from "../../../typechain-types/@openzeppelin/contracts";
import { MOMO721_ADDRESS, STAKING_ADDRESS } from "../../constants/constants";
import { Momo721Selector, StakingSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder, getAddress } from "ethers";
import { byte32ToAddress } from "../common/utils";

const getMomoInfo = async (n: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [n]);
    const data = Momo721Selector.GET_MOMO_INFO + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
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
    return decodedResult.toString();
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
    getPrototypeHashTime,
    getApproved,
    getPrototypeHash,
    tokensOfOwner,
    balanceOf,
    tokenOfOwnerByIndex,
    tokenByIndex,
    ownerOf
};
