import { MINT_MOMO_ADDRESS, STAKING_ADDRESS } from "../../constants/constants";
import { StakingSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder, getAddress } from "ethers";
import { getDataStorage, getDataStorageHistory } from "../common/utils";
import { sleep } from "../common/sleep";

const earned = async (userAddress: string) => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address"], [userAddress]);
    const data = StakingSelector.EARNED + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    return Number(result) / 10 ** 18;
};

const ownerOfTokenId = async (tokenId: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [tokenId]);
    const data = StakingSelector.OWNER_OF_TOKEN_ID + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    return getAddress("0x" + result.slice(26));
};

const tokensOfOwner = async (address: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = StakingSelector.TOKENS_OF_OWNER + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["uint256[]"], result);
    const nfts721 = decodedResult[0].map((x: bigint) => x.toString());
    return nfts721;
};

const userHashrate = async (address: string): Promise<number> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = StakingSelector.USER_HASH_RATE + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    return Number(result);
};

const getTokenIdUserByIndex = async (address: string, index: string): Promise<number> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address", "uint256"], [address, index]);
    const data = StakingSelector.GET_TOKEN_ID_USER_BY_INDEX + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    return Number(result);
};

const getAddressTopByUnknownIndex = async (n: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [n]);
    const data = StakingSelector.GET_ADDRESS_TOP_BY_UNKNOWN_INDEX + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    return getAddress("0x" + result.slice(26));
};

const getUserRewardInfo = async (address: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = StakingSelector.GET_USER_REWARD_INFO + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["uint256", "uint256", "uint256", "uint256"], result);
    const userRewardInfo = {
        userHash: Number(decodedResult[0]),
        unknown1: Number(decodedResult[1]),
        unknown2: Number(decodedResult[2]) / 10 ** 18,
        cacheEarned: Number(decodedResult[3]) / 10 ** 18
    };
    return userRewardInfo;
};

const getAmountUserMomo721Stake = async (address: string): Promise<number> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = StakingSelector.USER_MOMO721_STAKE + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    return Number(result);
};

const previewMysteryBox = async (address: string, amount: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address", "uint256"], [address, amount]);
    const data = "0x00117210" + encodedData.slice(2);
    try {
        const result = await ethersProvider.call({
            from: STAKING_ADDRESS,
            to: "0x1da9b6e37f006dd349089dea21cb8261391593d5",
            data: data
        });
        const decodedResult = abiCoder.decode(["uint256[]", "uint256[]", "uint256[]"], result);
        return decodedResult;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }
};

const getTotalHashRate = async (block: number) => {
    if (block < 0) {
        const result = await getDataStorage(STAKING_ADDRESS, "0x11");
        return Number(result);
    } else {
        const result = await getDataStorageHistory(STAKING_ADDRESS, "0x11", block);
        return Number(result);
    }
};

const getRewardRate = async (block: number) => {
    if (block < 0) {
        const result = await getDataStorage(STAKING_ADDRESS, "0x9");
        return Number(result) / 10 ** 18;
    } else {
        const result = await getDataStorageHistory(STAKING_ADDRESS, "0x9", block);
        return Number(result) / 10 ** 18;
    }
};

const getRewardPerPeriod = async (block: number) => {
    if (block < 0) {
        const result = await getDataStorage(STAKING_ADDRESS, "0xa");
        return Number(result);
    } else {
        const result = await getDataStorageHistory(STAKING_ADDRESS, "0xa", block);
        return Number(result);
    }
};

/**
 * Get reward per 1000 hashrate
 * @param block
 * if block > 0, get reward at block
 * if block <= 0, get reward at latest block
 * @return reward per 1000 hashrate
 */
const getRewardPer1000Hashrate = async (block: number, cacheRewardPer1000Hash: number) => {
    try {
        const rewardRate = await getRewardRate(block);
        await sleep(1);
        const rewardPerPeriod = await getRewardPerPeriod(block);
        await sleep(1);
        const totalHashRate = await getTotalHashRate(block);
        await sleep(1);
        console.log(rewardRate, rewardPerPeriod, totalHashRate);
        return (1000 * rewardPerPeriod * rewardRate) / (totalHashRate * 360);
    } catch (error) {
        console.log("error getRewardPer1000Hashrate", error);
        return cacheRewardPer1000Hash;
    }
};

const test = async () => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256[]"], [[41061]]);
    const data = "0x75481cff" + encodedData.slice(2);
    try {
        const result = await ethersProvider.call({
            from: MINT_MOMO_ADDRESS,
            to: STAKING_ADDRESS,
            data: data
        });
        // const decodedResult = abiCoder.decode(["uint256[]", "uint256[]", "uint256[]"], result);
        return result;
    } catch (error) {
        return (error as Error).message;
    }
};

export const stakingUtils = {
    earned,
    ownerOfTokenId,
    tokensOfOwner,
    userHashrate,
    getTokenIdUserByIndex,
    getAddressTopByUnknownIndex,
    getUserRewardInfo,
    getAmountUserMomo721Stake,
    previewMysteryBox,
    getTotalHashRate,
    getRewardRate,
    getRewardPerPeriod,
    getRewardPer1000Hashrate,
    test
};
