import { token } from "../../../typechain-types/@openzeppelin/contracts";
import { MOMO721_ADDRESS, STAKING_ADDRESS } from "../../constants/constants";
import { Momo1155Selector, StakingSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder, getAddress } from "ethers";
import { byte32ToAddress } from "../common/utils";

const test = async () => {
    const abiCoder = new AbiCoder();
    // const encodedData = abiCoder.encode(["uint256"], [n]);
    const data = Momo1155Selector.TEST; // + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO721_ADDRESS,
        data: data
    });
    const decodedResult = abiCoder.decode(["string"], result);
    return decodedResult.toString();
};

export const momo1155 = {
    test
};
