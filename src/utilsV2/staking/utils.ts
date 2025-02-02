import { getDataStorage, getDataStorageHistory } from "utilsV2/common/utils";
import { MINT_MOMO_ADDRESS, STAKING_ADDRESS } from "../../constants/constants";
import { StakingSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder, getAddress } from "ethers";

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
    const nfts721 = decodedResult[0].map((x: any) => x.toString());
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

const getUserRewardInfo = async (address: string): Promise<any> => {
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
        return (error as any).message;
    }
};

const getTotalHashRate = async () => {
    const result = await getDataStorage(STAKING_ADDRESS, "0x11");
    return Number(result);
};

const getRewardRate = async () => {
    const result = await getDataStorage(STAKING_ADDRESS, "0x9");
    return Number(result) / 10 ** 18;
};

const getRewardPerPeriod = async () => {
    const result = await getDataStorage(STAKING_ADDRESS, "0xa");
    return Number(result);
};

const getTotalHashRateHistory = async (block: number) => {
    const result = await getDataStorageHistory(STAKING_ADDRESS, "0x11", block);
    return Number(result);
};

const getRewardRateHistory = async (block: number) => {
    const result = await getDataStorageHistory(STAKING_ADDRESS, "0x9", block);
    return Number(result) / 10 ** 18;
};

const getRewardPerPeriodHistory = async (block: number) => {
    const result = await getDataStorageHistory(STAKING_ADDRESS, "0xa", block);
    return Number(result);
};

const getRewardPer1000Hashrate = async () => {
    const result = await getDataStorage(STAKING_ADDRESS, "0x12");
    return Number(result);
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
        return (error as any).message;
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
    getTotalHashRateHistory,
    getRewardRateHistory,
    getRewardPerPeriodHistory,
    getRewardPer1000Hashrate,
    test
};
