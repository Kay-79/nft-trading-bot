import { MOMO_ADDRESS } from "../../constants/constants";
import { MomoSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder, getAddress } from "ethers";

const earned = async (userAddress: string) => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address"], [userAddress]);
    const data = MomoSelector.EARNED + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    return Number(result) / 10 ** 18;
};

const ownerOfTokenId = async (tokenId: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [tokenId]);
    const data = MomoSelector.OWNER_OF_TOKEN_ID + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    return getAddress("0x" + result.slice(26));
};

const tokensOfOwner = async (address: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = MomoSelector.TOKENS_OF_OWNER + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["uint256[]"], result);
    const nfts721 = decodedResult[0].map((x: any) => x.toString());
    return nfts721;
};

const userHashrate = async (address: string): Promise<number> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = MomoSelector.USER_HASH_RATE + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    return Number(result);
};

const getTokenIdUserByIndex = async (address: string, index: string): Promise<number> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address", "uint256"], [address, index]);
    const data = MomoSelector.GET_TOKEN_ID_USER_BY_INDEX + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    return Number(result);
};

const getAddressTopByUnknownIndex = async (n: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [n]);
    const data = MomoSelector.GET_ADDRESS_TOP_BY_UNKNOWN_INDEX + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    return getAddress("0x" + result.slice(26));
};

const getUserRewardInfo = async (address: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = MomoSelector.GET_USER_REWARD_INFO + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["uint256", "uint256", "uint256", "uint256"], result);
    return decodedResult.toString();
};

const getAmountSomeThingOfUser = async (address: string): Promise<number> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["address"], [address]);
    const data = MomoSelector.GET_AMOUNT_SOME_THING_OF_USER + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    return Number(result);
};

const test = async (test: string, n: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [test]);
    const data = MomoSelector.UNKNOWN_3 + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    return result;
};

export const stakingUtils = {
    earned,
    ownerOfTokenId,
    tokensOfOwner,
    userHashrate,
    getTokenIdUserByIndex,
    getAddressTopByUnknownIndex,
    getUserRewardInfo,
    getAmountSomeThingOfUser,
    test
};
