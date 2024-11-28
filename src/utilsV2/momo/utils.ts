import { MOMO_ADDRESS } from "../../constants/constants";
import { MomoSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder } from "ethers";

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

const test = async (tokenId: string): Promise<string> => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [tokenId]);
    const data = "0x0eb9441f" + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO_ADDRESS,
        data: data
    });
    return "0x" + result.slice(26);
};

export const momoUtils = {
    earned,
    test
};
