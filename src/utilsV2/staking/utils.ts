import { STAKING_ADDRESS } from "../../constants/constants";
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

const getUserRewardInfo = async (address: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = StakingSelector.GET_USER_REWARD_INFO + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["uint256", "uint256", "uint256", "uint256"], result);
    return decodedResult.toString();
};

const getUserMomo721Stake = async (address: string): Promise<number> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = StakingSelector.USER_MOMO721_STAKE + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: STAKING_ADDRESS,
        data: data
    });
    return Number(result);
};


export const stakingUtils = {
    earned,
    ownerOfTokenId,
    tokensOfOwner,
    userHashrate,
    getTokenIdUserByIndex,
    getAddressTopByUnknownIndex,
    getUserRewardInfo,
    getUserMomo721Stake,
};
