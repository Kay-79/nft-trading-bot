import { token } from "../../../typechain-types/@openzeppelin/contracts";
import { MOMO1155_ADDRESS, MOMO721_ADDRESS, STAKING_ADDRESS } from "../../constants/constants";
import { Momo1155Selector, StakingSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder, getAddress } from "ethers";
import { byte32ToAddress } from "../common/utils";

const test = async (id: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [id]);
    const data = Momo1155Selector.TEST + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO1155_ADDRESS,
        data: data
    });
    console.log(result);
    const decodeData = abiCoder.decode(["string"], result);
    return decodeData;
    return result;
};

export const momo1155 = {
    test
};
